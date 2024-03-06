import Typewriter from 'typewriter-effect';

const TypeEffect = () => {
  const strings = [
    'Saurabh Thapliyal',
    'a Full Stack Web Developer',
  ];

  return (
    <Typewriter
      options={{
        autoStart: true,
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString(strings[0])
          .pauseFor(500)
          .deleteAll()
          .pauseFor(500)
          .typeString(strings[1])
          .pauseFor(500)
          .deleteAll()
          .pauseFor(500)
          .start();
      }}
    />
  );
};

export default TypeEffect;