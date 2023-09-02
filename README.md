
# 20:06

# 23:52 
Next.js Rendering SSR & CSR
Next JS, by default, all components are rendered server side

# 30:42
styling

# 35:52

# 1:06

# 1:28

# 1:40
data fetching

## client side

1. fetch useEffect
2. fetching library
3. react query
4. SWR

## server side

1. async 
2. getData on server
3. force-cache ( static data fetching )
4. revalidating (revalidate: 10)
5. cache: 'no-store' dynamic fetching


# 1:51  
Fetch from local JSON file

# 1:54 

## MongoDB
1. Create DB
2. Set up db.js
3. Set up models, and GET functionality on route.js for Posts url
4. Insert initial data into DB
5. Test out data for Blogs by calling Post urls

# 2:11

Generating SEO data

# 2:14

Next Auth library - Auth JS
http://authjs.dev  


# 2:25

Register form

# 2:32:38

Redirect to Login page

- useRouter
- router.push('/dashboard/login?success=Account has been created');
- create User in DB

# 2:37 - Sign In with User

CredentialsProvider({ id: "credentials", name: "Credentials})

use NextAuth's authorize:

async authorize(credentials) {
    connect to Mongo DB
    User.findOne ({ email: credentials.email })
    
}

Once the credentials come through, we can log it and view it.

AuthProvider uses NextAuth library as a client so that we can provide data in the layout.j

On server side:

 NextAuth
  providers: [
    CredentialsProvider
  ]
  pages: {
    errors:
  }


useSession:
https://next-auth.js.org/getting-started/client#usesession

