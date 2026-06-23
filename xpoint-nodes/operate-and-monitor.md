---
icon: gauge-high
---

# Operate and monitor a node

Node operation is a continuous responsibility. A staked node that stops serving traffic can become ineligible for rewards and can eventually be liquidated.

## Daily checks

```bash
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml ps
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml logs --tail 100 xnode
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml logs --tail 100 storage-service
curl http://127.0.0.1:8080/health/ready
curl http://127.0.0.1:22021/health/ready
```

## Important signals

Monitor:

- `xnode` restart count;
- Xray process status;
- registry heartbeat success;
- storage sidecar health;
- disk usage for storage volumes;
- public transport reachability on TCP `443`;
- private RPC/signing endpoint reachability from approved backends;
- staking obligation status;
- reward eligibility.

## Logs

Common log commands:

```bash
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml logs -f xnode
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml logs -f storage-service
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml logs --since 10m
```

## Control-plane checks

```bash
curl https://registry.xpoint.example/api/nodes
curl https://staking.xpoint.example/obligations
curl https://staking.xpoint.example/exit_liquidation_list
```

Use these endpoints to confirm that the node is both reachable and obligation-eligible.

