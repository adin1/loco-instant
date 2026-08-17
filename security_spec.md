# Security Specification for Loco Instant Firestore Database

## 1. Data Invariants
- `users/{userId}`: Only the authenticated user matching `userId` can create or update their own profile document. Public reads are restricted to verified providers or self.
- `quoteRequests/{quoteId}`: Clients can create requests and view their own requests; authenticated providers can list and view requests in their market.
- `orders/{orderId}`: Access is restricted to the client (`clientId`) and assigned provider (`providerId`).
- `reviews/{reviewId}`: Publicly readable; only authenticated users who completed an order can submit a review with rating 1-5.

## 2. Dirty Dozen Negative Test Payloads
1. User profile creation with mismatched `userId` != `request.auth.uid` -> MUST REJECT
2. User updating another user's profile -> MUST REJECT
3. Injecting an unverified admin role via client payload -> MUST REJECT
4. Submitting a quote request without valid phone number -> MUST REJECT
5. Creating an order with arbitrary client ID -> MUST REJECT
6. Modifying order escrow status without authorization -> MUST REJECT
7. Deleting another user's review -> MUST REJECT
8. Rating outside 1-5 integer range -> MUST REJECT
9. Unauthenticated read of sensitive user contact details -> MUST REJECT
10. Injecting oversized payloads (>2000 chars in review comments) -> MUST REJECT
11. Document ID containing illegal traversal characters -> MUST REJECT
12. Anonymous user bypassing authentication -> MUST REJECT
