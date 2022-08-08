import "./blog-slider.css"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from "swiper"
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import BlogCard from '../../Components/Blog-Card/BlogCard';

const BlogsCategorySliders = ({ data }) => {
    return (
        <div className="blog-category-slider-wrap">
            <h1 className="category-title">{data.category}</h1>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={5}
                scrollbar={{ draggable: true }}
                slidesPerView={4}
                speed={600}
                className={"swiper-wrapper"}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween:0
                    },
                    576: {
                        slidesPerView: 2,
                        spaceBetween:8
                    },
                    790: {
                        slidesPerView: 3,
                        spaceBetween:10
                    },
                    1500: {
                        slidesPerView: 4,
                        spaceBetween:12
                    },
                    2000: {
                        slidesPerView: 5,
                        spaceBetween:18
                    },
                  
                }}
            >
                {
                    data?.blogs?.map((blog, index) => (
                        <SwiperSlide key={index}>
                            <BlogCard key={index} blog={blog} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

export default BlogsCategorySliders