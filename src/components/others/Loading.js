import React from "react";
import GifLoader from 'react-gif-loader';

const Loading = () => {
    return (
        <GifLoader
            loading={true}
            imageSrc="https://media.giphy.com/media/l378zKVk7Eh3yHoJi/source.gif"
            overlayBackground="rgba(0,0,0,0.5)"
        />
    )
}

export default Loading;

