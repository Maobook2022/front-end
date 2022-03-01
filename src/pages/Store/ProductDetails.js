import '../Store/style/ProductDetailsStyle.scss'
import { Modal, Button, Row, Col, Carousel } from 'react-bootstrap'
import { useState } from 'react'

//元件
import Counter from './components/Counter'

//圖片
import Hill from './productsImages/Hill’s-001-1.png'
function ProductDetails(props) {
  const { name, price, des, stock, item, amount, ADDToLocalStorage, id } = props
  const [index, setIndex] = useState(0)

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex)
  }
  const { show, setShow } = props //商品細節頁接收傳入值
  // const [show, setShow] = useState(false); //Modal

  return (
    <>
      {/* <Button variant="primary" onClick={() => setShow(true)}>
                Custom Width Modal
            </Button> */}

      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header className="m-header" closeButton></Modal.Header>
        <Modal.Body className="show-grid">
          <Row>
            <Col xs={12} md={7}>
              <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                className="imgchange"
              >
                <Carousel.Item className="imgarea">
                  <img
                    className="d-block img-fluid "
                    src={Hill}
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block img-fluid"
                    src={Hill}
                    alt="Second slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block img-fluid"
                    src={Hill}
                    alt="Third slide"
                  />
                </Carousel.Item>
              </Carousel>
            </Col>
            <Col xs={6} md={5} className="d-flex align-items-center">
              <section>
                <h1>{name}</h1>
                <p>{des}</p>
                <p>庫存:{stock}</p>
                <div className="d-flex justify-content-between align-items-center mr-5">
                  <h3>${price}</h3>
                  <div className="mr-5 ">
                    <Counter /> {/*將值傳入屬性*/}
                  </div>
                </div>
                <Row className="mt-3 pt-3 d-flex align-items-center share">
                  <Col>
                    <button>分享商品</button>
                  </Col>
                  <Col className=" ml-5">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        ADDToLocalStorage({
                          id: id,
                          name: name,
                          amount: 1,
                          price: price,
                        })
                      }}
                    >
                      加入購物車
                    </button>
                  </Col>
                </Row>
              </section>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ProductDetails
