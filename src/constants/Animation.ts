import { Pressable } from "react-native";
import Animated, { FadeInDown, FadeInUp, LinearTransition } from "react-native-reanimated"

export const _damping = 14;
export const _entering = FadeInUp.springify().damping(_damping);
export const _exiting = FadeInDown.springify().damping(_damping);
export const _layout = LinearTransition.springify().damping(_damping);

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable)