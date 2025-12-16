from datetime import datetime
import uuid

import pytest
from rest_framework import status

from apps.properties.models import Favorite, Property, PropertyReview
from apps.users.models import Notification


@pytest.mark.django_db
def test_property_list_filters_public_properties(api_client, create_property):
    """Anonymous users should only see approved, publicly available properties."""
    create_property(property_name="Approved Property")
    create_property(
        property_name="Sold Property",
        property_status=Property.PropertyStatus.SOLD,
    )
    create_property(
        property_name="Pending Property",
        listing_status=Property.ListingStatus.PENDING,
    )

    response = api_client.get("/api/v1/properties/")

    assert response.status_code == status.HTTP_200_OK
    names = {prop["property_name"] for prop in response.data["data"]}
    assert names == {"Approved Property", "Sold Property"}
    assert "Pending Property" not in names


@pytest.mark.django_db
def test_property_list_for_agent_shows_only_owned(
    auth_client, create_property, create_user, agent_user
):
    """Agents should only see their own listings (including non-approved ones)."""
    create_property(
        property_name="My Listing",
        listing_status=Property.ListingStatus.PENDING,
    )
    other_agent = create_user("otheragent@test.com", user_type="AGENT")
    create_property(
        property_name="Other Agent Listing",
        listed_by=other_agent,
        listing_status=Property.ListingStatus.APPROVED,
    )

    client = auth_client(agent_user)
    response = client.get("/api/v1/properties/")

    assert response.status_code == status.HTTP_200_OK
    names = {prop["property_name"] for prop in response.data["data"]}
    assert names == {"My Listing"}


@pytest.mark.django_db
def test_property_detail_by_slug_returns_related_properties(api_client, create_property):
    """Retrieve by slug should include related properties by city/state."""
    main_property = create_property(
        property_name="Central Loft", city="Lagos", state="Lagos"
    )
    create_property(property_name="City Match", city="Lagos", state="Lagos")
    create_property(property_name="State Match", city="Ibadan", state="Lagos")
    create_property(property_name="Different State", city="Abuja", state="FCT")

    response = api_client.get(f"/api/v1/properties/{main_property.slug}/")

    assert response.status_code == status.HTTP_200_OK
    data = response.data["data"]
    related_names = {prop["property_name"] for prop in data["related_properties"]}

    assert data["property_name"] == "Central Loft"
    assert "City Match" in related_names
    assert "State Match" in related_names
    assert "City Match" in related_names
    assert "State Match" in related_names
    assert len(related_names) == 3


@pytest.mark.django_db
def test_favorite_toggle_adds_and_removes(
    auth_client, client_user, create_property
):
    """Posting to favorites/toggle should add then remove the favorite."""
    property_obj = create_property(property_name="Favorite Target")
    client = auth_client(client_user)

    add_response = client.post(
        "/api/v1/favorites/toggle/",
        {"property_id": property_obj.id},
        format="json",
    )
    assert add_response.status_code == status.HTTP_200_OK
    assert Favorite.objects.filter(user=client_user, property=property_obj).exists()

    remove_response = client.post(
        "/api/v1/favorites/toggle/",
        {"property_id": property_obj.id},
        format="json",
    )
    assert remove_response.status_code == status.HTTP_200_OK
    assert not Favorite.objects.filter(
        user=client_user, property=property_obj
    ).exists()


@pytest.mark.django_db
def test_property_documents_visibility_varies_by_user(
    auth_client,
    admin_user,
    client_user,
    agent_user,
    create_property,
    create_document,
):
    """Owners/staff see all documents; others only see verified ones."""
    property_obj = create_property(
        property_name="Documented Property", listed_by=agent_user
    )
    verified_doc = create_document(
        property_obj, uploaded_by=agent_user, is_verified=True, filename="verified.pdf"
    )
    create_document(property_obj, uploaded_by=agent_user, filename="pending.pdf")

    admin_response = auth_client(admin_user).get(
        f"/api/v1/properties/{property_obj.id}/documents/"
    )
    assert admin_response.status_code == status.HTTP_200_OK
    assert len(admin_response.data["data"]) == 2

    client_response = auth_client(client_user).get(
        f"/api/v1/properties/{property_obj.id}/documents/"
    )
    assert client_response.status_code == status.HTTP_200_OK
    assert len(client_response.data["data"]) == 1
    assert client_response.data["data"][0]["id"] == verified_doc.id


@pytest.mark.django_db
def test_create_review_succeeds_and_notifies_admins(
    auth_client,
    client_user,
    agent_user,
    admin_user,
    create_property,
):
    """Submitting a review should create the review and notify admins."""
    property_obj = create_property(
        property_name="Review Target",
        listed_by=agent_user,
        listing_status=Property.ListingStatus.APPROVED,
    )
    client = auth_client(client_user)

    response = client.post(
        "/api/v1/reviews/create/",
        {
            "reviewed_property": property_obj.id,
            "rating": 4,
            "comment": "Great place",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert PropertyReview.objects.filter(
        reviewed_property=property_obj, reviewer=client_user
    ).exists()
    assert Notification.objects.filter(
        user=admin_user, notification_type="review_approval_required"
    ).count() == 1


@pytest.mark.django_db
def test_create_review_rejects_self_review(auth_client, agent_user, create_property):
    """Agents/owners cannot review their own properties."""
    property_obj = create_property(
        property_name="My Listing",
        listed_by=agent_user,
        listing_status=Property.ListingStatus.APPROVED,
    )
    client = auth_client(agent_user)

    response = client.post(
        "/api/v1/reviews/create/",
        {
            "reviewed_property": property_obj.id,
            "rating": 5,
            "comment": "This is mine",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["success"] is False


@pytest.mark.django_db
def test_list_property_reviews_returns_only_approved(
    api_client, create_property, client_user, create_user
):
    """Listing property reviews should include only approved ones with stats."""
    property_obj = create_property(property_name="Reviewed Property")
    other_user = create_user("another@test.com", user_type="CLIENT")
    third_user = create_user("third@test.com", user_type="CLIENT")

    PropertyReview.objects.create(
        reviewed_property=property_obj,
        reviewer=client_user,
        rating=5,
        comment="Loved it",
        status=PropertyReview.ReviewStatus.APPROVED,
    )
    PropertyReview.objects.create(
        reviewed_property=property_obj,
        reviewer=other_user,
        rating=3,
        comment="It was ok",
        status=PropertyReview.ReviewStatus.APPROVED,
    )
    PropertyReview.objects.create(
        reviewed_property=property_obj,
        reviewer=third_user,
        rating=1,
        comment="Pending review",
        status=PropertyReview.ReviewStatus.PENDING,
    )

    response = api_client.get(f"/api/v1/reviews/property/{property_obj.id}/")

    assert response.status_code == status.HTTP_200_OK
    data = response.data["data"]
    ratings = {review["rating"] for review in data["reviews"]}

    assert data["total_reviews"] == 2
    assert data["average_rating"] == 4.0
    assert ratings == {3, 5}
    assert data["rating_breakdown"]["5_star"] == 1
    assert data["rating_breakdown"]["3_star"] == 1
    assert data["rating_breakdown"]["1_star"] == 0


@pytest.mark.django_db
def test_agent_property_analytics_forbidden_for_client(auth_client, client_user):
    """Clients should not be able to access agent analytics."""
    response = auth_client(client_user).get("/api/v1/analytics/agent/")

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.data["success"] is False


@pytest.mark.django_db
def test_agent_property_analytics_returns_summary(auth_client, agent_user, create_property):
    """Analytics endpoint should return monthly data plus a summary row."""
    current_year = datetime.now().year
    create_property(
        property_name="Sold Home",
        listed_by=agent_user,
        property_status=Property.PropertyStatus.SOLD,
        sale_price=200000,
        listed_date=datetime(current_year, 1, 15),
    )
    create_property(
        property_name="Rented Flat",
        listed_by=agent_user,
        listing_type=Property.ListingType.RENT,
        property_status=Property.PropertyStatus.RENTED,
        rent_price=1500,
        listed_date=datetime(current_year, 2, 10),
    )

    response = auth_client(agent_user).get(
        f"/api/v1/analytics/agent/?year={current_year}&period_type=monthly"
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.data["data"]
    summary = data[-1]

    assert summary["period"] == "Total"
    assert summary["total_properties"] == 2
    assert summary["sold_properties"] == 1
    assert summary["rented_properties"] == 1
    assert float(summary["total_revenue"]) == 201500


@pytest.mark.django_db
def test_property_create_success_for_agent(auth_client, agent_user, amenity):
    """Agents can create sale properties and serializer computes totals."""
    client = auth_client(agent_user)
    sale_price = 100000
    expected_total = 110000  # sale_price + 10% agent commission

    response = client.post(
        "/api/v1/properties/",
        {
            "property_name": "New Build",
            "description": "Brand new",
            "property_type": Property.PropertyType.HOUSE,
            "listing_type": Property.ListingType.SALE,
            "location": "123 Street",
            "state": "Lagos",
            "city": "Lagos",
            "sale_price": sale_price,
            "total_price": expected_total,
            "amenities_ids": [amenity.id],
        },
    )

    assert response.status_code == status.HTTP_201_CREATED
    created = Property.objects.get(property_name="New Build")
    assert created.total_price == expected_total
    assert created.amenities.filter(id=amenity.id).exists()


@pytest.mark.django_db
def test_property_create_forbidden_for_client(auth_client, client_user):
    """Clients cannot create properties."""
    response = auth_client(client_user).post(
        "/api/v1/properties/",
        {
            "property_name": "Client Attempt",
            "description": "Should fail",
            "property_type": Property.PropertyType.HOUSE,
            "listing_type": Property.ListingType.SALE,
            "location": "Somewhere",
            "sale_price": 50000,
            "total_price": 55000,
        },
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_property_update_and_delete_permissions(
    auth_client, create_property, create_user, agent_user
):
    """Owners can patch/delete; others are forbidden."""
    property_obj = create_property(property_name="Updatable", sale_price=90000)
    other_agent = create_user("intruder@test.com", user_type="AGENT")

    # Owner can patch
    updated_total = 99000  # 90000 + 10% commission
    patch_response = auth_client(agent_user).patch(
        f"/api/v1/properties/{property_obj.slug}/",
        {"sale_price": 90000, "total_price": updated_total},
    )
    assert patch_response.status_code == status.HTTP_200_OK

    # Other agent cannot patch
    forbidden_response = auth_client(other_agent).patch(
        f"/api/v1/properties/{property_obj.slug}/",
        {"sale_price": 80000, "total_price": 88000},
    )
    assert forbidden_response.status_code in (
        status.HTTP_403_FORBIDDEN,
        status.HTTP_404_NOT_FOUND,
    )

    # Owner can delete
    delete_response = auth_client(agent_user).delete(
        f"/api/v1/properties/{property_obj.slug}/"
    )
    assert delete_response.status_code == status.HTTP_204_NO_CONTENT
    assert not Property.objects.filter(id=property_obj.id).exists()


@pytest.mark.django_db
def test_property_list_filters_by_lister_and_total(
    api_client, create_property, create_user
):
    """lister_type and min_total filters should narrow results."""
    agent = create_user("filteragent@test.com", user_type="AGENT")
    landlord = create_user("filterlandlord@test.com", user_type="LANDLORD")
    create_property(
        property_name="Agent Listing",
        listed_by=agent,
        total_price=300000,
    )
    create_property(
        property_name="Landlord Listing",
        listed_by=landlord,
        total_price=150000,
    )

    response = api_client.get("/api/v1/properties/?lister_type=AGENT&min_total=200000")

    assert response.status_code == status.HTTP_200_OK
    names = {prop["property_name"] for prop in response.data["data"]}
    assert names == {"Agent Listing"}


@pytest.mark.django_db
def test_property_detail_lookup_by_id(api_client, create_property):
    """Retrieval should work with numeric ID as well as slug."""
    property_obj = create_property(property_name="ID Lookup Home")

    response = api_client.get(f"/api/v1/properties/{property_obj.id}/")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["data"]["property_name"] == "ID Lookup Home"


@pytest.mark.django_db
def test_favorite_list_returns_user_favorites(
    auth_client, client_user, create_property
):
    """Favorites list should return only the user's favorites."""
    property_one = create_property(property_name="Fav One")
    property_two = create_property(property_name="Fav Two")
    Favorite.objects.create(user=client_user, property=property_one)
    Favorite.objects.create(user=client_user, property=property_two)

    response = auth_client(client_user).get("/api/v1/favorites/")

    assert response.status_code == status.HTTP_200_OK
    names = {fav["property"]["property_name"] for fav in response.data["data"]}
    assert names == {"Fav One", "Fav Two"}


@pytest.mark.django_db
def test_document_upload_update_delete_permissions(
    auth_client, agent_user, client_user, create_property, create_document, uploaded_file_factory
):
    """Property owners can add/update/delete documents; others cannot."""
    property_obj = create_property(property_name="Docs Home", listed_by=agent_user)
    other_doc = create_document(property_obj, uploaded_by=agent_user)

    # Upload by owner succeeds
    upload_response = auth_client(agent_user).post(
        f"/api/v1/properties/{property_obj.id}/documents/",
        {
            "document_type": other_doc.document_type,
            "file": uploaded_file_factory("newfile.pdf"),
        },
        format="multipart",
    )
    assert upload_response.status_code == status.HTTP_200_OK
    assert Property.objects.get(id=property_obj.id).documents.count() == 2

    # Update by owner succeeds
    update_response = auth_client(agent_user).put(
        f"/api/v1/properties/{property_obj.id}/documents/{uuid.UUID(int=other_doc.id)}/",
        {
            "document_type": other_doc.document_type,
            "file": uploaded_file_factory("owner-updated.pdf"),
        },
        format="multipart",
    )
    assert update_response.status_code == status.HTTP_200_OK

    # Update by non-owner forbidden
    update_response_forbidden = auth_client(client_user).put(
        f"/api/v1/properties/{property_obj.id}/documents/{uuid.UUID(int=other_doc.id)}/",
        {
            "document_type": other_doc.document_type,
            "file": uploaded_file_factory("updated.pdf"),
        },
        format="multipart",
    )
    assert update_response_forbidden.status_code == status.HTTP_403_FORBIDDEN

    # Delete by non-owner forbidden
    delete_forbidden = auth_client(client_user).delete(
        f"/api/v1/properties/{property_obj.id}/documents/{uuid.UUID(int=other_doc.id)}/"
    )
    assert delete_forbidden.status_code == status.HTTP_403_FORBIDDEN

    # Delete by owner succeeds
    delete_response = auth_client(agent_user).delete(
        f"/api/v1/properties/{property_obj.id}/documents/{uuid.UUID(int=other_doc.id)}/"
    )
    assert delete_response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_amenities_list_returns_active_only(api_client, amenity):
    """Amenities endpoint should list only active amenities."""
    from apps.properties.models import Amenity

    Amenity.objects.create(name="Inactive Amenity", is_active=False)

    response = api_client.get("/api/v1/amenities/")

    assert response.status_code == status.HTTP_200_OK
    names = {item["name"] for item in response.data["data"]}
    assert "Inactive Amenity" not in names
    assert amenity.name in names


@pytest.mark.django_db
def test_all_property_reviews_list(api_client, create_property, create_user):
    """All reviews endpoint should return approved reviews across properties."""
    property_one = create_property(property_name="Prop One")
    property_two = create_property(property_name="Prop Two")
    reviewer = create_user("reviewer@test.com", user_type="CLIENT")
    second_reviewer = create_user("secondreviewer@test.com", user_type="CLIENT")

    PropertyReview.objects.create(
        reviewed_property=property_one,
        reviewer=reviewer,
        rating=5,
        comment="Great",
        status=PropertyReview.ReviewStatus.APPROVED,
    )
    PropertyReview.objects.create(
        reviewed_property=property_two,
        reviewer=reviewer,
        rating=4,
        comment="Nice",
        status=PropertyReview.ReviewStatus.APPROVED,
    )
    PropertyReview.objects.create(
        reviewed_property=property_two,
        reviewer=second_reviewer,
        rating=2,
        comment="Pending",
        status=PropertyReview.ReviewStatus.PENDING,
    )

    response = api_client.get("/api/v1/reviews/all/")

    assert response.status_code == status.HTTP_200_OK
    ratings = {review["rating"] for review in response.data}
    assert ratings == {4, 5}


@pytest.mark.django_db
def test_agent_property_analytics_yearly(auth_client, agent_user, create_property):
    """Yearly analytics should aggregate per year and include summary."""
    current_year = datetime.now().year
    prior_year = current_year - 1
    create_property(
        property_name="Last Year Sale",
        listed_by=agent_user,
        property_status=Property.PropertyStatus.SOLD,
        sale_price=50000,
        listed_date=datetime(prior_year, 6, 1),
    )
    create_property(
        property_name="This Year Rent",
        listed_by=agent_user,
        listing_type=Property.ListingType.RENT,
        property_status=Property.PropertyStatus.RENTED,
        rent_price=1200,
        listed_date=datetime(current_year, 3, 1),
    )

    response = auth_client(agent_user).get(
        f"/api/v1/analytics/agent/?year={prior_year}&period_type=yearly"
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.data["data"]
    summary = data[-1]
    assert summary["period"] == "Total"
    assert summary["sold_properties"] == 1
    assert summary["rented_properties"] == 1


@pytest.mark.django_db
def test_agent_property_analytics_invalid_year(auth_client, agent_user):
    """Invalid year query parameter should return 400."""
    response = auth_client(agent_user).get(
        "/api/v1/analytics/agent/?year=invalid"
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["success"] is False
