import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

// Register Swiper modules manually
Swiper.use([Navigation, Pagination]);

const blogFeatSwiper = new Swiper('.swiper.is-blog-feat', {
    spaceBetween: 24,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.blog_feat-pagination.is-next',
      prevEl: '.blog_feat-pagination.is-prev',
    },
    breakpoints: {
      991: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });