import React, { Component, PropTypes } from 'react';
import { View, UIManager, requireNativeComponent, findNodeHandle } from 'react-native';

const RCTVLCVideoViewConstants = UIManager.RCTVLCVideoView.Constants;

class VLCVideo extends Component {
    constructor(props) {
        super(props);

        this._assignRoot = this._assignRoot.bind(this);
        
        this.callbacks = {
            [RCTVLCVideoViewConstants.ON_MEDIA_CHANGED]: this._invokeEventCallback.bind(this, 'onMediaChanged'),
            [RCTVLCVideoViewConstants.ON_BUFFERING]: this._invokeEventCallback.bind(this, 'onBuffering'),
            [RCTVLCVideoViewConstants.ON_PLAYING]: this._invokeEventCallback.bind(this, 'onPlaying'),
            [RCTVLCVideoViewConstants.ON_PAUSED]: this._invokeEventCallback.bind(this, 'onPaused'),
            [RCTVLCVideoViewConstants.ON_END_REACHED]: this._invokeEventCallback.bind(this, 'onEndReached'),
            [RCTVLCVideoViewConstants.ON_ERROR]: this._invokeEventCallback.bind(this, 'onError'),
            [RCTVLCVideoViewConstants.ON_TIME_CHANGED]: this._invokeEventCallback.bind(this, 'onTimeChanged')
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.sourceUrl !== this.props.sourceUrl ||
            nextProps.keyControlEnabled !== this.props.keyControlEnabled ||
            nextProps.style !== this.props.style;
    }
    
    render() {
        const media = {
            sourceUrl: this.props.sourceUrl,
            autoplay: this.props.autoplay,
            startTime: this.props.startTime
        };

        return (
            <RCTVLCVideoView 
                ref={this._assignRoot}
                style={this.props.style}
                keyControlEnabled={this.props.keyControlEnabled}
                media={media}
                {...this.callbacks}
            />
        );
    }

    _assignRoot(root) {
        this._root = root;
    }

    _getViewHandle() {
        return findNodeHandle(this._root);
    }

    _invokeEventCallback(eventName, event) {
        if (typeof this.props[eventName] === 'function') {
            this.props[eventName](event.nativeEvent);
        }
    }

    seek(time) {
        if (typeof time !== 'number' || isNaN(time) || time < 0) {
            time = 0;
        }

        UIManager.dispatchViewManagerCommand(
            this._getViewHandle(),
            UIManager.RCTVLCVideoView.Commands.seek,
            time
        );
    }

    play() {
        UIManager.dispatchViewManagerCommand(
            this._getViewHandle(),
            UIManager.RCTVLCVideoView.Commands.play,
            null
        );
    }

    pause() {
        UIManager.dispatchViewManagerCommand(
            this._getViewHandle(),
            UIManager.RCTVLCVideoView.Commands.pause,
            null
        );
    }

}

VLCVideo.propTypes = {
    ...View.propTypes,
    sourceUrl: PropTypes.string.isRequired,
    autoplay: PropTypes.bool.isRequired,
    startTime: PropTypes.number.isRequired,
    keyControlEnabled: PropTypes.bool.isRequired,
    onMediaChanged: PropTypes.func,
    onBuffering: PropTypes.func,
    onPlaying: PropTypes.func,
    onPaused: PropTypes.func,
    onEndReached: PropTypes.func,
    onError: PropTypes.func,
    onTimeChanged: PropTypes.func
};

VLCVideo.defaultProps = {
    autoplay: true,
    startTime: 0,
    keyControlEnabled: false
};

const RCTVLCVideoViewInterface = {
    name: 'VLCVideo',
    propTypes: {
        ...View.propTypes,
        media: PropTypes.object.isRequired,
        keyControlEnabled: PropTypes.bool.isRequired,
        onMediaChanged: PropTypes.func,
        onBuffering: PropTypes.func,
        onPlaying: PropTypes.func,
        onPaused: PropTypes.func,
        onEndReached: PropTypes.func,
        onError: PropTypes.func,
        onTimeChanged: PropTypes.func
    }
};

const RCTVLCVideoView = requireNativeComponent('RCTVLCVideoView', RCTVLCVideoViewInterface, {
    nativeOnly: {
        media: true,
        keyControlEnabled: true
    }
});

export default VLCVideo;
