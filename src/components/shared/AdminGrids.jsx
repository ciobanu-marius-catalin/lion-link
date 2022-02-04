import React from 'react'
import GridElement from "./GridElement";

class AdminGrids extends React.Component
{
    generateGrids(data)
    {
        return data.map( element => (
            <GridElement key={element.id} data={element}/>
        ))
    }
    render()
    {
        return (
            <div>
            {this.generateGrids(this.props.data)}
            </div>
        );
    }
}

export default AdminGrids
