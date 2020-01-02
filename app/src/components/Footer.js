import React from 'react';

class Footer extends React.Component {
    render() {
        return <footer>
            <p className="title">Copyleft <span className="copyleft">&copy;</span> d3bate {new Date().getFullYear()}</p>
            <div className='row-left-justified'>
                <div className='col-33'>
                    <ul>
                        <li><a href="https://github.com/d3bate/d3bate">Source code</a></li>
                        <li><a
                            href="https://github.com/d3bate/d3bate/issues/new?assignees=&labels=&template=feature_request.md&title=">Request
                            a new feature</a></li>
                        <li><a
                            href="https://github.com/d3bate/d3bate/issues/new?assignees=&labels=&template=bug_report.md&title=%5BBUG%5D">Report
                            a problem</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    }
}

export {Footer}
