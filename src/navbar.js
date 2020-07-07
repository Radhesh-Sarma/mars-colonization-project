import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';


/**
 *
 * @param {props} props
 * @return {*}
 * @constructor
 */

class Navbarr extends Component {
  constructor() {
    super();
    this.state ={

    };
  }
  render() {
    return (
      <Navbar expand="lg">
        <Navbar.Brand >Conquer Mars!</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="mr-auto">
            <NavDropdown title="Algorithms" id="basic-nav-dropdown">
              <NavDropdown.Item >A*</NavDropdown.Item>
              <NavDropdown.Item >Best First Search</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick ={this.props.dijkstra}>Dijkstra</NavDropdown.Item>
              <NavDropdown.Item onClick ={this.props.dijkstra} >BFS</NavDropdown.Item>
              <NavDropdown.Item onClick ={this.props.dfs}>DFS</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Speed" id="basic-nav-dropdown">
              <NavDropdown.Item onClick = {() => this.props.newSpeed(750)}>Slow</NavDropdown.Item>
              <NavDropdown.Item onClick = {() => this.props.newSpeed(350)}>Medium</NavDropdown.Item>
              <NavDropdown.Item onClick = {() => this.props.newSpeed(1)}>Fast</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav.Link onClick ={this.props.randomize}>Randomize</Nav.Link>
          <Nav.Link onClick ={this.props.clearWalls}>Clear Grid</Nav.Link>
          <Nav.Link >Clear Path</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Navbarr.propTypes = {
  clearWalls: PropTypes.func,
  randomize: PropTypes.func,
  newSpeed: PropTypes.func,
  dijkstra: PropTypes.func,
  dfs: PropTypes.func,
};
export default Navbarr;

