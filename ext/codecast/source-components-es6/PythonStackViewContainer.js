class PythonStackViewContainer extends React.Component {
    constructor(props) {
        super(props);

        const MAX_CONTENT_HEIGHT = 225;

        const DESKTOP_TOP_MARGIN = 86;
        const DESKTOP_RIGHT_MARGIN = 36;

        const DESKTOP_MIN_WIDTH = 855;
        const MOBILE_BOTTOM_MENU_HEIGHT = 49;
        const MOBILE_RIGHT_MARGIN = 0;

        let initTop = DESKTOP_TOP_MARGIN;
        let initRight = DESKTOP_RIGHT_MARGIN;
        if (this.getWindowWidth() < DESKTOP_MIN_WIDTH) {
            initTop = (this.getWindowHeight() - MAX_CONTENT_HEIGHT - MOBILE_BOTTOM_MENU_HEIGHT),
            initRight = MOBILE_RIGHT_MARGIN;
        }

        this.ref = React.createRef();
        this.state = {
            top: initTop,
            right: initRight,
            width: 275,
            maxContentHeight: MAX_CONTENT_HEIGHT,
            dragging: false,
            collapsed: false
        };
    }

    getWindowWidth = () => {
        return Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
    };

    getWindowHeight = () => {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.documentElement.clientHeight
        );
    };

    mouseDownHandler = (e) => {
        const rect = this.ref.current.getBoundingClientRect();

        this.setState({
            ...this.state,
            dragging: true,
            refLeft: e.pageX - rect.left,
            refTop: e.pageY - rect.top
        });
    };

    mouseUpHandler = () => {
        this.setState({
            ...this.state,
            dragging: false
        });
    };

    mouseMoveHandler = (mouseX, mouseY) => {
        if (this.state.dragging) {
            const rect = this.ref.current.getBoundingClientRect();

            const minTop = 0;
            const maxTop = (this.getWindowHeight() - rect.height);
            const minRight = 0;
            const maxRight = (this.getWindowWidth() - rect.width);

            this.setState((state) => {
                let newTop = (mouseY - state.refTop);
                if (newTop < minTop) {
                    newTop = minTop;
                } else if (newTop > maxTop) {
                    newTop = maxTop;
                }

                let newRight = (this.getWindowWidth() - mouseX - rect.width + state.refLeft);
                if (newRight < minRight) {
                    newRight = minRight;
                } else if (newRight > maxRight) {
                    newRight = maxRight;
                }

                return {
                    ...this.state,
                    right: newRight,
                    top: newTop
                };
            })
        }
    };

    toggleCollapsedHandler = () => {
        this.setState((state) => ({
            ...state,
            collapsed: !state.collapsed
        }));
    };

    render() {
        if (!this.props.analysis) {
            return <React.Fragment></React.Fragment>;
        }

        let panelClasses = 'skulpt-analysis-container panel panel-default';
        let iconClasses = 'fas fa-minus-square';
        if (this.state.collapsed) {
            panelClasses += ' collapsed';
            iconClasses = 'fas fa-plus-square';
        }

        let display = 'block';
        if (!this.props.show) {
            display = 'none';
        }

        return (
            <div ref={this.ref} style={{
                top: this.state.top + 'px',
                right: this.state.right + 'px',
                width: this.state.width + 'px',
                display: display
            }} className={panelClasses}>
                <div
                    className='panel-heading'
                    onMouseDown={this.mouseDownHandler}
                >
                    <div className="icon" onClick={this.toggleCollapsedHandler}>
                        <i className={iconClasses}></i>
                    </div>
                    Variables
                </div>
                <div style={{
                    maxHeight: this.state.maxContentHeight + 'px'
                }} className='panel-body'>
                    <PythonStackView
                        analysis={this.props.analysis}
                    />
                </div>
            </div>
        );
    }
};
