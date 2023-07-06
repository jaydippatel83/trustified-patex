import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";

const Testimonial = () => { 
  return (
    <div className="testimonials-one__carousel-outer">
      <div className="testimonials-one__carousel">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}  
          modules={[Autoplay]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="item">
              <div className="testimonials-one__single">
                <div className="testimonials-one__inner">  
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <div className="testimonials-one__single1">
                <div className="testimonials-one__inner">  
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="item">
              <div className="testimonials-one__single2">
                <div className="testimonials-one__inner">  
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="testimonials-one__carousel__shape-one"></div>
      <div className="testimonials-one__carousel__shape-two"></div>
    </div>
  );
};
export default Testimonial;
