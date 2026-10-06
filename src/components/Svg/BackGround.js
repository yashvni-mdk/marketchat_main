import * as React from "react"
import Svg, {
  Path,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"

const BackGround=()=> {
  return (
    <Svg
      width={375}
      height={812}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M-18.5 888.5c-1.2 5.2 265.167-661.167 398.5-995H-26.5c3.167 329.5 9.2 989.8 8 995z"
        fill="url(#prefix__paint0_linear)"
      />
      <Path
        opacity={0.5}
        d="M-28.738-51.462L368.751 842.91 244.016-361.902-28.737-51.462z"
        fill="url(#prefix__paint1_linear)"
      />
      <Path
        d="M372.002-106.469c1.2-5.2-265.167 661.166-398.5 995h406.5c-3.167-329.5-9.2-989.8-8-995z"
        fill="url(#prefix__paint2_linear)"
      />
      <Path
        d="M365.485-52.475c.207-5.332-136.93 699.075-205.524 1051.945l399.338-75.971C494.608 600.396 365.278-47.142 365.485-52.475z"
        fill="url(#prefix__paint3_linear)"
      />
      <Ellipse
        cx={188}
        cy={330}
        rx={280}
        ry={640}
        transform="rotate(-180 188 330)"
        fill="url(#prefix__paint4_linear)"
        fillOpacity={0.4}
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={176.75}
          y1={-106.5}
          x2={176.75}
          y2={888.53}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#232952" />
          <Stop offset={1} stopColor="#3C487D" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint1_linear"
          x1={380.37}
          y1={-83.845}
          x2={-109.802}
          y2={156.527}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#232952" />
          <Stop offset={1} stopColor="#3C487D" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint2_linear"
          x1={176.752}
          y1={888.531}
          x2={176.752}
          y2={-106.5}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#232952" />
          <Stop offset={1} stopColor="#3C487D" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint3_linear"
          x1={359.63}
          y1={961.484}
          x2={173.669}
          y2={-16.014}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#232952" />
          <Stop offset={1} stopColor="#3C487D" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint4_linear"
          x1={188}
          y1={-5.5}
          x2={188}
          y2={970}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#7189FF" />
          <Stop offset={1} stopColor="#303968" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default BackGround
