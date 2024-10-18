# Notesheet Tracker

This project manages and tracks payment bills passed by the PIC (Payment In Charge) for various clubs. It supports three types of notesheet templates:

1. **Reimbursement**: Used to request compensation for personal expenses incurred during an event. For example, if a club member spent their own money on an event, they can request reimbursement for the amount spent.
2. **Disbursement**: Used to request advance money for an upcoming event. This helps in getting funds before the event takes place.
3. **Settlement**: Used for settling all bills and expenses related to an event after it has concluded. This template helps in ensuring that all payments and dues are cleared.

Once a notesheet is created, it goes through a series of approvals from different authorities in a predefined sequence. For example, a reimbursement notesheet will first be submitted to the General Secretary (GenSec), followed by the Vice President Gymkhana (VPG), then to the President Gymkhana, followed by the Payment In Charge (PIC), and finally the Assistant Dean (ADean). The notesheet is approved only after all necessary approvals are granted.

## Installation Guide

To get started, install the necessary dependencies by running the following command at the root dir:

```bash
npm run install-all
```

This will install dependencies for both the client and server.

## Running Guide

Once the dependencies are installed, you can start the development environment, at the root dir, with:

```bash
npm run dev
```

This will run both the client and server concurrently. The application will be available at:

-   Client: [http://localhost:3000](http://localhost:3000)
-   Server: [http://localhost:8000](http://localhost:8000)

To run the client or server individually, you can use the following commands:

```bash
# Start the client
npm run client

# Start the server
npm run server
```

## Production Guide

To run the application in production mode,, at the root dir, use:

```bash
npm start
```

This will run both the server and client simultaneously in a production environment.
