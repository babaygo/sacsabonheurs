# Sacs à Bonheurs
> Site e-commerce de ventes de sacs fait de façon artisanal en France.

### 🖥️ [Demo](https://sacsabonheurs.fr)

## Install
```sh
git clone https://github.com/simonlaurent/sacsabonheur.git

cd sacsabonheur
```
### Backend
```sh
cd backend

npm install

docker-compose up --build -d

npx prisma generate

npx prisma migrate dev

npx prisma db seed
```

### Frontend
```sh
cd frontend

npm run dev

access on http://localhost:3000
```
