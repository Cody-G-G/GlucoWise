import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const icons = {
    "bluetooth": [27, "#bbb"],
};

const defaultIconProvider = MaterialIcons;

let iconsMap = {};
let iconsLoaded = new Promise((resolve, reject) => {
    new Promise.all(
        Object.keys(icons).map(iconName => {
            const Provider = icons[iconName][2] || defaultIconProvider;
            return Provider.getImageSource(
                iconName,
                icons[iconName][0],
                icons[iconName][1]
            );
        })
    ).then(sources => {
        Object.keys(icons).forEach((iconName, idx) => iconsMap[iconName] = sources[idx]);
        resolve(true);
    })
});

export {
    iconsMap,
    iconsLoaded
};