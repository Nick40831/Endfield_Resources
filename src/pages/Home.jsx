import Carousel from '../components/Carousel';
import CarouselIcon from '../components/CarouselIcon';
import HH10Permit from '../assets/HH10Permit.png';
import Origeometry from '../assets/Origeometry.png';
import BasicAICIndex from '../assets/BasicAICIndex.png';
import TPPoint from '../assets/TPPoint.png';
import Protohedron from '../assets/Protohedron.png';
import ArmsINSPSet from '../assets/ArmsINSPSet.png';
import TalesOfTheBizarreWild from '../assets/TalesOfTheBizarreWild.png';
import './Home.css'


const ToolCarouselIcons = [
  {
    img: HH10Permit,
    title: 'Pull Simulation',
    class: 'carouselButton',
    link: '/head_hunting',
  },
  {
    img: Origeometry,
    title: 'Income Calculator',
    class: 'carouselButton outOfOrder',
    link: '/income_calculator',
  },
  {
    img: BasicAICIndex,
    title: 'Factory Tool',
    class: 'carouselButton planned',
    link: '/factory_tool',
  },
  {
    img: TPPoint,
    title: 'Interactive Map',
    class: 'carouselButton planned',
    link: '/interactive_map',
  },
  {
    img: Protohedron,
    title: 'Operator Level Calculator',
    class: 'carouselButton planned',
    link: '/operator_level_calculator',
  },
  {
    img: ArmsINSPSet,
    title: 'Weapon Level Calculator',
    class: 'carouselButton planned',
    link: '/weapon_level_calculator',
  },
  {
    img: TalesOfTheBizarreWild,
    title: 'Extra Resources',
    class: 'carouselButton planned',
    link: '/extra_resources',
  },
]


export function Home() {
  return (
    <>
      <div id='content'>
        <h2>Tools</h2> 
        <Carousel>
          {ToolCarouselIcons.map((icon, index) => (
            <CarouselIcon
              key={index}
              img={icon.img}
              title={icon.title}
              className={icon.class}
              link={icon.link}
            />
          ))} 
        </Carousel>
      </div>
    </>
  )
}

export default Home