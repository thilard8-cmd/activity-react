import { useState, useEffect } from 'react'

export default function Display({ onLogout }) {

  const [products, setProducts] = useState([])
  const [rides, setRides] = useState('')
  const [price, setPrice] = useState('')

  const api_url = 'http://localhost:8080/api/product'

  useEffect(() => {
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data)
      })
      .catch((err) => {
        console.log(err)
      })

  }, [])

  async function formSubmit(event) {
    event.preventDefault()
    try {

      const response = await fetch(api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rides: rides,
          price: price
        })
      })

      const newProduct = await response.json()

      setProducts((currentProducts) => [
        ...currentProducts,
        newProduct
      ])

      setRides('')
      setPrice('')

    } catch (err) {

      console.log(err)

    }
  }

  function handleLogout() {
    onLogout?.()
  }

  return (

    <div className="bg-primary-subtle" style={{ minHeight: "100vh" }}>
      <div className="text-center d-flex justify-content-center flex-column bg-primary-subtle">
        <header className="fw-bold text-primary text-start bg-dark m-2 p-4 mx-1">
          Padyak-All <i className='bi bi-bicycle text-primary m-1'></i>
        </header>

        <h1 className="fw-bold text-primary" style={{fontFamily:'monospace'}}>
          Bookings
        </h1>
        <h1>potanginamo</h1>

        <form onSubmit={formSubmit}>
          <label
            className="fw-light"
            htmlFor="rides"
          >
            Rides:
          </label>

          <input
            type="text"
            className="form-control "
            style={{ width: "300px", margin: "auto" }}
            id="rides"
            placeholder="Rides"
            value={rides}
            onChange={(event) =>
              setRides(event.target.value)
            }
          />

          <label
            className="fw-light"
            htmlFor="price"
          >
            Price:
          </label>

          <input
            type="number"
            className="form-control mb-2"
            style={{ width: "300px", margin: "auto" }}
            placeholder="Price"
            id="price"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
          />

          <input
            type="submit"
            value="Submit"
          />

        </form>

        <table
          className="table table-striped mt-3"
          style={{ border: '1px solid black' }}
        >
          <thead className='table-dark'>
            <tr>
              <td>Rides</td>
              <td>Price</td>
            </tr>
          </thead>

          <tbody className="table ">
            {products.map((product, index) => (
              <tr key={index}>
                <td>
                  {product.rides}
                </td>
                <td>
                  {product.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='fixed-bottom'>
          <button
            type="button"
            className="btn btn-outline-primary btn-lg my-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}