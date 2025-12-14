Manual tests for the app

Edit User flow

1. Start the backend server:

```bash
node server.js
```

2. Start the frontend:

```bash
npm start
```

3. In the app, go to "Users" and click "Edit" on any user.
4. The drawer should open with the form populated with the user's details.
5. Update fields and click "Update". The drawer should close and the user list refresh.

If user fields are empty when the drawer opens, check the server logs for errors and ensure the new endpoint `GET /api/users/:id` is reachable.
