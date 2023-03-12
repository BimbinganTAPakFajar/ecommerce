
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import NavigationBar from '@/components/NavigationBar'
import axios from 'axios'
import ReviewCard from '@/components/ReviewCard'

export async function getServerSideProps(context){
  const [productsres, reviewsres] = await Promise.all([
    axios.get("http://localhost:8080/products"),
    axios.get("http://localhost:8080/reviews")
  ])
  const products = productsres.data;
  const reviews = reviewsres.data;

  return {
    props: { products, reviews }
  }
}

export default function Home({ products, reviews}) {
  const renderProducts = () => {
    return products.map((p) => {
      return <ProductCard src={p.image} name={p.name} amount={p.sold}></ProductCard>
    })
  }

  const renderReviews = () => {
    return reviews.map((p) => {
      return <ReviewCard src={p.image} name={p.name} desc={p.desc}></ReviewCard>
    })
  }

  console.log(products.length, 'test')
  return (
    <div className='bg-white w-full flex flex-col '>
      <NavigationBar/>


      <section className='grid grid-cols-2 w-full gap-x-3 p-4 mt-10 bg-main rounded-md'>
        <div className='flex items-center'>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur eius labore vel exercitationem rerum molestiae adipisci odit, ea magnam qui totam cupiditate accusamus et nesciunt dolor quas nemo cum quo.
          </p>
        </div>
        <div >
          <img className='rounded-md' src="images/farmers.jpg" alt="" />
        </div>

      </section>
      <section className='flex flex-col items-center py-10 bg-[#f5f5f5]'>
        <Header>
          Produk
        </Header>
        <div className='flex overflow-x-scroll gap-2 p-5 drop-shadow-md'>
          {renderProducts()}
        </div>
       
      </section>

      <section className='flex flex-col items-center pt-10'>
        <Header>
          Ulasan
        </Header>
        <div className='flex overflow-x-scroll gap-2'>
          {renderReviews()}
        </div>
      </section>
    </div>
  )
}
