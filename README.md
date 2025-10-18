<h1 align="center">Welcome to Sacs à Bonheurs 👋</h1>
<p>
</p>

> Site e-commerce de ventes de sacs fait de façon artisanal en France.

### ✨ [Demo](https://sacsabonheur.vercel.app/)

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

## Author

👤 **Simon Laurent**

* Github: [@babaygo](https://github.com/babaygo)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_