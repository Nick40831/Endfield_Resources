import Carousel from '../../../components/Carousel.jsx';
import CarouselIcon from '../../../components/CarouselIcon.jsx';

import Landmine from '../../../assets/Landmine.png'
import HHPermit from '../../../assets/HHPermit.png'
import TargetedWeaponSupply from '../../../assets/TargetedWeaponSupply.png'

import './ExtraCarousel.css'

const ExtraCarouselIcons = [
  {
    img: Landmine,
    title: 'Landmine Stats',
    class: 'carouselButton',
    link: '/landmine',
  },
  {
    img: HHPermit,
    title: 'Headhunting',
    class: 'carouselButton',
    link: '/head_hunting',
  },
  {
    img: TargetedWeaponSupply,
    title: 'Arsenal Exchange',
    class: 'carouselButton',
    link: '/arsenal_exchange',
  },
];

export function ExtraCarousel() {
  return (
    <Carousel>
      {ExtraCarouselIcons.map((icon, index) => (
        <CarouselIcon
          key={index}
          img={icon.img}
          title={icon.title}
          className={icon.class}
          link={icon.link}
        />
      ))} 
    </Carousel>
  );
}

export default ExtraCarousel