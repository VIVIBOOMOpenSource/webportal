/* eslint-disable */
import randomColor from "../vendor/randomColor";
import VivitaLogo from "../../css/imgs/boom-imgs/confetti/vivitalogo.png";
import Balloon from "../../css/imgs/boom-imgs/confetti/balloon.png";

export default function RandomConfetti() {
  let randomNumber = Math.floor(Math.random() * effects.length);
  effects[randomNumber]();
}

let positions = ["bottomLeftRight", "topLeftRight"];
const randomPosition = () => {
  return positions[Math.floor(Math.random() * positions.length)];
};

let angles = [45, 90, 135, 180, 225, 270, 315];
const randomAngle = () => {
  return angles[Math.floor(Math.random() * angles.length)];
};

let effects = [];
effects.push(() => {
  new confettiKit({
    colors: randomColor({ hue: "red", count: 10, luminosity: "light" }),
    confettiCount: 20,
    angle: randomAngle(),
    startVelocity: 100,
    elements: {
      confetti: {
        direction: "down",
        rotation: true,
      },
      custom: [
        {
          count: 2,
          width: 120,
          textSize: 15,
          content: VivitaLogo,
          contentType: "image",
          direction: "down",
          rotation: true,
        },
        {
          count: 5,
          width: 25,
          textSize: 50,
          content: "V",
          contentType: "text",
          direction: "down",
          rotation: true,
        },
      ],
    },
    position: randomPosition(),
    decay: 0.92,
  });

  new confettiKit({
    colors: randomColor({ hue: "blue", count: 10, luminosity: "light" }),
    confettiCount: 20,
    angle: randomAngle(),
    startVelocity: 100,
    elements: {
      star: {
        count: 10,
        direction: "down",
        rotation: true,
      },
      custom: [
        {
          count: 5,
          width: 25,
          textSize: 50,
          content: "V",
          contentType: "text",
          direction: "down",
          rotation: true,
        },
      ],
    },
    position: randomPosition(),
    decay: 0.92,
  });

  new confettiKit({
    colors: randomColor({ hue: "red", count: 10, luminosity: "light" }),
    confettiCount: 20,
    angle: randomAngle(),
    startVelocity: 100,
    elements: {
      ribbon: {
        count: 5,
        direction: "down",
        rotation: true,
      },
      custom: [
        {
          count: 5,
          width: 25,
          textSize: 50,
          content: "V",
          contentType: "text",
          direction: "down",
          rotation: true,
        },
      ],
    },
    position: randomPosition(),
    decay: 0.92,
  });
});
effects.push(() => {
  new confettiKit({
    colors: randomColor({ hue: "red", count: 10, luminosity: "light" }),
    confettiCount: 40,
    angle: randomAngle(),
    startVelocity: 100,
    elements: {
      confetti: {
        direction: "down",
        rotation: true,
      },
    },
    position: randomPosition(),
    decay: 0.92,
  });
});
effects.push(() => {
  new confettiKit({
    colors: randomColor({ hue: "red", count: 10, luminosity: "light" }),
    confettiCount: 60,
    angle: randomAngle(),
    startVelocity: 100,
    elements: {
      confetti: {
        direction: "down",
        rotation: true,
      },
    },
    position: randomPosition(),
    decay: 0.92,
  });
});
effects.push(() => {
  new confettiKit({
    confettiCount: 70,
    angle: randomAngle(),
    startVelocity: 50,
    colors: randomColor({ hue: "blue", count: 18 }),
    elements: {
      confetti: {
        direction: "down",
        rotation: true,
      },
      star: {
        count: 10,
        direction: "down",
        rotation: true,
      },
      ribbon: {
        count: 5,
        direction: "down",
        rotation: true,
      },
      custom: [
        {
          count: 4,
          width: 50,
          textSize: 15,
          content: Balloon,
          contentType: "image",
          direction: "up",
          rotation: false,
        },
      ],
    },
    position: randomPosition(),
  });
});
effects.push(() => {
  new confettiKit({
    confettiCount: 70,
    angle: 90,
    startVelocity: 50,
    elements: {
      confetti: {
        direction: "down",
        rotation: true,
      },
      star: {
        count: 10,
        direction: "down",
        rotation: true,
      },
      ribbon: {
        count: 5,
        direction: "down",
        rotation: true,
      },
    },
    x: screen.width / 5,
    y: screen.height / 3,
  });
  new confettiKit({
    confettiCount: 70,
    angle: randomAngle(),
    startVelocity: 50,
    elements: {
      confetti: {
        direction: "down",
        rotation: true,
      },
      star: {
        count: 10,
        direction: "down",
        rotation: true,
      },
      ribbon: {
        count: 5,
        direction: "down",
        rotation: true,
      },
    },
    x: screen.width / 2,
    y: screen.height / 3,
  });
});
effects.push(() => {
  new confettiKit({
    colors: randomColor({ hue: "pink", count: 18 }),
    confettiCount: 70,
    angle: 90,
    startVelocity: 50,
    elements: {
      confetti: {
        direction: "down",
        rotation: true,
      },
      star: {
        count: 10,
        direction: "down",
        rotation: true,
      },
      ribbon: {
        count: 5,
        direction: "down",
        rotation: true,
      },
    },
    position: "topLeftRight",
  });
});
effects.push(() => {
  new confettiKit({
    colors: randomColor({ hue: "green", count: 18 }),
    confettiCount: 70,
    angle: 90,
    startVelocity: 50,
    elements: {
      confetti: {
        direction: "down",
        rotation: true,
      },
      star: {
        count: 10,
        direction: "down",
        rotation: true,
      },
      ribbon: {
        count: 5,
        direction: "down",
        rotation: true,
      },
    },
    position: "topLeftRight",
  });
});
effects.push(() => {
  new confettiKit({
    colors: randomColor({ hue: "blue", count: 18 }),
    confettiCount: 70,
    angle: 90,
    startVelocity: 50,
    elements: {
      confetti: {
        direction: "down",
        rotation: true,
      },
      star: {
        count: 10,
        direction: "down",
        rotation: true,
      },
      ribbon: {
        count: 5,
        direction: "down",
        rotation: true,
      },
    },
    position: "topLeftRight",
  });
});
