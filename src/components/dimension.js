import { Dimensions, Image } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export { WIDTH, HEIGHT };

export const getImageSize = (uri) => {

    return new Promise((resolve, reject) => {
        Image.getSize(uri, (width, height) => {
            resolve({ width, height })
        }, (err) => {
            if (err) reject(err)
        })
    })
}
