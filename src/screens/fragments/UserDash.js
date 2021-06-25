import React from "react"
import { Card, Icon, Checkbox } from "semantic-ui-react"
import { Responsive, WidthProvider } from "react-grid-layout"
//comps
import AbstractComponent from "../../components/AbstractComponent"

const ResponsiveGridLayout = WidthProvider(Responsive)

class UserDash extends AbstractComponent {
    constructor(props) {
        super(props)

        this.state = {
            items: [],
            moveMode: false
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.sidebarState != null && prevProps.sidebarState != null && prevProps.sidebarState != this.props.sidebarState) {
            console.log("dispatching...")
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 200)
        }
    }

    render() {
        return (
            <div className="w-full h-full pt-16 bg-gray-800 flex flex-col">
                <div className="w-100 h-8 p-4 mb-2">
                    <Checkbox className="checkbox" onChange={(it, value) => this.setState({ moveMode: value.checked })} value={this.state.moveMode} label='Move cards' />
                </div>
                <ResponsiveGridLayout
                    className="layout"
                    cols={{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }}
                    rowHeight={30}
                    width={1200}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    draggableHandle=".card-dragger"
                    isResizable={false}
                >
                    <div key="a" data-grid={{ x: 0, y: 0, w: 1, h: 8 }}>
                        {this.state.moveMode ? <DragMove /> : null}
                        <CardComponent 
                            header={"Ma première carte !"}
                            meta={"Meta de la carte"}
                            description={"La description est làààà"}
                            extra={"25 likes"}
                        />
                    </div>
                    <div key="b" data-grid={{ x: 1, y: 0, w: 1, h: 8 }}>
                        {this.state.moveMode ? <DragMove /> : null}
                        <CardComponent 
                            header={"Ma deuxième carte !"}
                            meta={"Meta de la carte x2"}
                            description={"La description est encore làààà"}
                            extra={"9999 likes"}
                        />
                    </div>
                    <div key="c" data-grid={{ x: 2, y: 0, w: 1, h: 8 }}>
                        {this.state.moveMode ? <DragMove /> : null}
                        <CardComponent 
                            header={"Ma troisième carte !"}
                            meta={"Meta de la carte x3"}
                            description={"La description est toujours làààà"}
                            extra={"-1 likes"}
                        />
                    </div>
                </ResponsiveGridLayout>

            </div>
        )
    }
}

class DragMove extends React.Component {
    render() {
        return (
            <div className="card-dragger w-auto absolute z-10 right-0 top-4">
                <Icon name='move' />
            </div>
        )
    }
}
class CardComponent extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Card className='w-full h-full'>
                <Card.Content>
                    <Card.Header>{this.props.header}</Card.Header>
                    <Card.Meta>
                        <span className='date'>{this.props.meta}</span>
                    </Card.Meta>
                    <Card.Description>
                        {this.props.description}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <Icon name='like' />
                        {this.props.extra}
                    </a>
                </Card.Content>
            </Card>
        )
    }
}

export default UserDash