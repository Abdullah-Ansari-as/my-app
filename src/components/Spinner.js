import React, { Component } from "react";

import loading from '../loading.gif'

export class Spinner extends Component{
    render() {
        return(

            <div className="text-center mt-2" >
            <img className="my-2" src={loading} style={{height: '30px'}} alt="loading..." />
            </div>

        )
    }
}

export default Spinner