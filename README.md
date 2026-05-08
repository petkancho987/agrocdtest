# Hello Test App - ArgoCD Deployment

Просто Node.js приложение за тестване на ArgoCD с Kubernetes.

## Описание

Приложението показва "Hello Test" през браузър, развернато на Kubernetes cluster с:
- **2 реплики** на приложението
- **Pod Anti-Affinity** - всяка реплика работи на отделен node
- **LoadBalancer Service** - достъпно през MetalLB
- **ArgoCD** - автоматично управление и синхронизация

## Архитектура

```
Master Node (VM-1)
├── ArgoCD
├── Helm
└── MetalLB

Worker Node 1 (VM-2)
└── Pod 1 (hello-test-app)

Worker Node 2 (VM-3)
└── Pod 2 (hello-test-app)

LoadBalancer (MetalLB)
└── Service (hello-test-app-lb) Port 80
```

## Стартиране

### 1. Изграждане на Docker образа

```bash
docker build -t petkancho987/hello-test-app:latest .
docker push petkancho987/hello-test-app:latest
```

### 2. Регистриране на репозиторията в ArgoCD

```bash
# Влезте в ArgoCD master node
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Отворете браузър на https://localhost:8080
# По подразбиране потребител: admin
# Парола: kubectl get secret -n argocd argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode

# Или използвайте ArgoCD CLI
argocd login localhost:8080
argocd repo add https://github.com/petkancho987/agrocdtest.git
```

### 3. Развертане чрез ArgoCD

```bash
kubectl apply -f argocd/application.yaml
```

### 4. Проверка на статуса

```bash
# Проверете дали приложението е синхронизирано
kubectl get application -n argocd

# Проверете pods
kubectl get pods -l app=hello-test-app

# Проверете на кой node е всеки pod
kubectl get pods -l app=hello-test-app -o wide
```

### 5. Достъп към приложението

```bash
# Получете LoadBalancer IP
kubectl get svc hello-test-app-lb

# Отворете браузър с IP адреса
# http://<EXTERNAL-IP>
```

## Файлова структура

```
agrocdtest/
├── app.js                    # Node.js приложение
├── Dockerfile               # Docker образ
├── package.json            # Node.js зависимости
├── k8s/
│   ├── deployment.yaml     # Kubernetes Deployment (2 реплики)
│   └── service.yaml        # LoadBalancer Service
├── argocd/
│   └── application.yaml    # ArgoCD Application манифест
└── README.md               # Тази документация
```

## Особености

- ✅ **Pod Anti-Affinity**: Гарантира, че двата pod-а работят на различни nodes
- ✅ **Health Checks**: Livenss и Readiness probes
- ✅ **Resource Limits**: Ограничени CPU и памет за всеки pod
- ✅ **ArgoCD Sync**: Автоматична синхронизация и self-healing
- ✅ **MetalLB LoadBalancer**: Реална LoadBalancer адреса на локален cluster

## Отстраняване на неизправности

### Pods не се разпределят на разни nodes
```bash
# Проверете node labels
kubectl get nodes --show-labels

# Проверете pod affinity
kubectl describe pod -l app=hello-test-app
```

### LoadBalancer няма external IP
```bash
# Проверете MetalLB статус
kubectl get pods -n metallb-system

# Проверете IP pool
kubectl get ipaddresspool -n metallb-system
```

### ArgoCD не синхронизира
```bash
# Проверете ArgoCD logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller

# Принудителна синхронизация
argocd app sync hello-test-app
```

## Тестване

```bash
# Проверете отговора от приложението
curl http://<EXTERNAL-IP>

# Проверете logs
kubectl logs -l app=hello-test-app

# Изтрийте pod и проверете дали се създава нов
kubectl delete pod -l app=hello-test-app
kubectl get pods -l app=hello-test-app -w
```

## Лицензия

MIT
