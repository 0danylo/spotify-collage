export const getTopCovers = tracks => {
    let freqs = new Map();

    tracks.forEach(track => {
        const images = track.track.album.images;
        if (images.length == 0)
            return;
        
        const url = images[1].url;

        if (freqs.has(url))
            freqs.set(url, freqs.get(url) + 1);
        else
            freqs.set(url, 1);
    });

    freqs = new Map([...freqs.entries()].sort((a, b) => b[1] - a[1]));

    const numCovers = getNumCovers(Array.from(freqs.keys()));
    return {
        covers: Array.from(freqs.keys()).slice(0, numCovers),
        sideLength: getSideLength(numCovers)
    };
}

const getNumCovers = (tracks) => {
    let len = tracks.length;

    if (len < 4) {
        return 1;
    } else if (len < 100) {
        return 4;
    } else {
        return 9;
    }
}

const getSideLength = (numCovers) => {
    switch (numCovers) {
        case 1:
            return 1;
        case 4:
            return 2;
        case 9:
            return 3;
    }
}