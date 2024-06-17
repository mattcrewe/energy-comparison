# EPTech Assessment - Enengy comparison site

## Requirements
- docker
- docker compose

## Installation

Create `.env` file following the template:

```
POSTGRES_DB=EPTech-assessment
POSTGRES_USER=EPTECH
POSTGRES_PASSWORD=<set postgres password>
```

Run in production mode:

```bash
docker compose up
```
Navigate to <localhost:8000> in your web browser to access

Run in dev mode:

```bash
docker compose -f compose-dev.yaml up
```

Navigate to <localhost:7000> in your web browser to access