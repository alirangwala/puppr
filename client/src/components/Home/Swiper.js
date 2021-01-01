import React, { useState, useContext } from 'react';
import SwiperCore, { Lazy } from 'swiper';
import PropTypes from 'prop-types';
import { Swiper as ReactSwiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import '../../../node_modules/swiper/components/lazy/lazy.scss';
import '../../../node_modules/swiper/components/lazy/lazy.min.css';
import Slide from './Slide';
import DogsContext from '../../context/dogs/dogsContext';
import ChatContext from '../../context/chat/chatContext';
import { useAuth0 } from '@auth0/auth0-react';
import woofBot from '../../utils/woofBot';

SwiperCore.use([Lazy]);

const Swiper = ({ dogs }) => {
  const dogArr = [...dogs];
  const [currentDogs, setCurrentDogs] = useState(dogArr.slice(0, 2));
  const { createMatch, incrementNewMatches } = useContext(DogsContext);
  const { incrementNewMessageCount, createMessage } = useContext(ChatContext);
  const { user } = useAuth0();

  const handleDogs = (dir) => {
    if (dir === 'prev') {
      createMatch(user.sub, dogArr[0].dog_id);
      incrementNewMatches();
      //create a dummy message to user randomly
      if (Math.random() > 0.7) {
        const messageObj = {
          from_human: false,
          user_id: user.sub,
          dog_id: dogArr[0].dog_id,
          body: woofBot(),
        };
        const timeout = Math.floor(Math.random() * (15000 - 3000) + 3000);
        setTimeout(async () => {
          await createMessage(messageObj);
          incrementNewMessageCount();
        }, timeout);
      }
      //reset the current dog that is in the swipe loop
      dogArr.splice(0, 1);
      setCurrentDogs(dogArr.slice(0, 1));
    } else if (dir === 'next') {
      dogArr.splice(0, 1);
      setCurrentDogs(dogArr.slice(0, 1));
    }
  };

  return (
    <div>
      <h3>Swiper</h3>
      <ReactSwiper
        spaceBetween={20}
        slidesPerView={1}
        onSlideChange={(swipe) => {
          handleDogs(swipe.swipeDirection);
        }}
        onSwiper={(swiper) => {}}
        preloadImages={false}
        lazy={true}
        loop={true}>
        {currentDogs.length
          ? currentDogs.map((dog) => {
              return (
                <SwiperSlide key={`img_src_${dog.dog_id}`}>
                  <Slide dog={dog} />
                </SwiperSlide>
              );
            })
          : null}
      </ReactSwiper>
    </div>
  );
};

Swiper.propTypes = {
  dogs: PropTypes.array.isRequired,
};

export default Swiper;
