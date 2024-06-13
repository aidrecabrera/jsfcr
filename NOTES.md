Logical Grouping:
Main Navigation: Contains frequently used primary features.
Additional Navigation: Includes supplementary or less frequent options.

# Method of Storing Fingerprints

```mermaid
sequenceDiagram
    participant User
    participant Application
    participant Database
    participant Supabase

    User->>Application: Upload Fingerprint Image
    Application->>Supabase: Store Image
    Supabase-->>Application: Return Image URL
    Application->>Application: Generate Hash of Image
    Application->>Database: Store Image URL and Hash

    User->>Application: Retrieve Fingerprint Image
    Application->>Database: Fetch Image URL
    Database-->>Application: Return Image URL
    Application->>Supabase: Retrieve Image
    Supabase-->>Application: Return Image

    User->>Application: Change Fingerprint Image
    Application->>Supabase: Store New Image
    Supabase-->>Application: Return New Image URL
    Application->>Application: Generate Hash of New Image
    Application->>Database: Update URL and Hash
    Application->>Supabase: (Optional) Delete Old Image
```

# Registration and Login Process

```mermaid
sequenceDiagram
    actor Admin
    participant Supabase
    actor Employee

    Admin->>Supabase: Initiate registration<br/>with employee details
    Supabase-->>Employee: Send registration<br/>details or confirmation

    Employee->>Supabase: Log in with<br/>credentials
    Supabase-->>Employee: Validate credentials<br/>and grant access
```

![Fingerprint Process](docs/sequence-fingerprint.svg)

![Fingerprint Process](image.png)
