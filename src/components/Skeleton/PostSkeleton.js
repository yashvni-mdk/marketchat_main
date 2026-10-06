// PostSkeleton.js
import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../../../constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../Pixel';
import fontFamily from '../../../constants/fontFamily';

const PostSkeleton = () => {
    return (
        <View style={{
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#fff',
            // borderRadius: wp(2),
            alignSelf: 'center',
            marginBottom: hp(1),
            paddingBottom: hp(2),
        }}>
            {/* <View
                style={{
                    flexDirection: 'row',
                    height: hp(8),
                    width: '92%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignSelf: 'center',
                }}>
                <ShimmerPlaceholder speed={1000}
                    visible={false}
                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                    direction="right"
                    style={{ height: hp(5), width: hp(5), borderRadius: hp(5) }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '94%' }}>
                    <View style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center', }}>
                        <ShimmerPlaceholder speed={1000}
                            visible={false}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            direction="right"
                            style={{ height: hp(2), marginBottom: hp(1), width: wp(28), marginHorizontal: wp(2) }} />
                        <ShimmerPlaceholder speed={1000}
                            visible={false}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            direction="right"
                            style={{ height: hp(2), width: wp(28) }} />
                    </View>
                </View>

            </View>
            <ShimmerPlaceholder autoRun={true}
                speed={1000}
                visible={false}
                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                direction="right"
                style={{ height: hp(30), width: '100%' }} />
            <View style={{
                width: '100%',
                height: hp(4),
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: wp(4),
                marginTop: hp(1),
                marginBottom: hp(0.5)
            }}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }}>
                   <ShimmerPlaceholder speed={1000}
                        visible={false}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        direction="right"
                        style={{ height: hp(2), width: wp(5) }} />
                    <ShimmerPlaceholder speed={1000}
                        visible={false}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        direction="right"
                        style={{ height: hp(2), width: wp(10) }} />
                </View>
                <ShimmerPlaceholder speed={1000}
                    visible={false}
                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                    direction="right"
                    style={{ height: hp(2), width: wp(20) }} />
            </View>
            <View style={{
                borderBottomColor: COLORS.gray,
                borderBottomWidth: 0.5,
                width: '100%',
            }} />
            <View style={{ paddingTop: hp(1.5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', alignSelf: "center" }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <ShimmerPlaceholder speed={1000}
                        visible={false}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        direction="right"
                        style={{ width: wp(15), paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} />
                    <ShimmerPlaceholder speed={1000}
                        visible={false}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        direction="right"
                        style={{ width: wp(15), paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} />
                    <ShimmerPlaceholder speed={1000}
                        visible={false}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        direction="right"
                        style={{ width: wp(15), paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} />
                </View>
                <ShimmerPlaceholder speed={1000}
                    visible={false}
                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                    direction="right"
                    style={{ width: wp(15), paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} />
            </View> */}
        </View>
    );
};

export default PostSkeleton;
