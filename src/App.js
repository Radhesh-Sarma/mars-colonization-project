import React, { Component } from "react";
import Grid from "./Grid";
import Navbar from "./Navbar"
import Modal from  "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import PriorityQueue from "./priorityq";
import Graph from "./Algo/Graph"
import {bestfs} from "./Algo/Bestfs";
import {dfs} from "./Algo/dfs";
import {Dijkstra} from "./Algo/Dijkstra";
import {AStar} from "./Algo/AStar";
import {TSP} from "./Algo/TSP";
import {aStarForTSP} from "./Algo/TSP";
//This is the modal to display path not found
const D = ({ handleClose, show}) => {
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                style={{
                    opacity: "90%",
                    backgroundColor: '#000000',
                    color: '#fee440'
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Uh-Oh!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    PATH TO THE TARGET NOT FOUND!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

class App extends Component {
    state = {
        height: 20, // height of the grid
        width: 20, // width of the grid
        start: [10, 2], // start position
        end: [10, 15],// end position
        grid: Array(20).fill(undefined, undefined, undefined).map(() => Array(20).fill(0)),
        speed: 50, // speed for animation
        pointer: [], // store the pointer for visualization
        modalshow: false,
        heuristics:Array(20).fill(undefined, undefined, undefined).map(() => Array(30).fill(0)),
        path: [],
        graph:null,
        changeSource:false,
        changeDestination:false,
        multipledestinations:false,
        visual:false,
        grid2:null ,
    };
    constructor() {
        super();
        this.state.grid[this.state.start[0]][this.state.start[1]] = 3; // special point : start point
        this.state.grid[this.state.end[0]][this.state.end[1]] = 4; // special point : end point
        this.state.graph = new Graph(this.state.grid);
        this.computeHeuristics();
    }
    bestfs = bestfs.bind(this);
    dfs = dfs.bind(this);
    Dijkstra = Dijkstra.bind(this);
    AStar = AStar.bind(this);
    TSP = TSP.bind(this);
    aStarForTSP = aStarForTSP.bind(this);
    toggleSource=()=>this.setState({changeSource: !this.state.changeSource});
    toggleDestination = ()=>{
        if(this.state.multipledestinations)
            this.setState({changeDestination: true});
        else {
        this.setState({changeDestination: !this.state.changeDestination});}
    }
    changedSource=(i,j)=> {
        let grid = this.state.grid;
        grid[this.state.start[0]][this.state.start[1]] = 0;
        grid[i][j] = 3; // special point : end point
        this.setState({
            changeSource: !this.state.changeSource,
            start: [i, j],
            grid,
        });
    }
    changedDestination = (i,j)=> {
        let grid = this.state.grid;
        grid[this.state.end[0]][this.state.end[1]] = 0;
        grid[i][j] = 4; // special point : end point
        this.setState({
            changeDestination: !this.state.changeDestination,
            end: [i, j],
            grid,
        });
        this.setState({grid});
    }

    multiDestination = () => {
        if (this.state.multipledestinations === false) {
            this.setState({multipledestinations: true});
        }
    }
    showModal = () => this.setState({ modalshow: true });
    hideModal = () => this.setState({ modalshow: false });
    computeHeuristics= ()=>{
        let heuristics = this.state.heuristics;
        for(let i = 0; i < this.state.height; i++)
        {
            for(let j = 0; j < this.state.width; j++)
            {
                heuristics[i][j] = Math.abs(this.state.end[0]-i) + Math.abs(this.state.end[1]-j);
            }
        }
        this.setState({heuristics});
    }
    randomizeMatrix = () => {
        this.clearGrid();
        const newGrid = Array(this.state.height).fill(undefined, undefined, undefined).map(() => Array(this.state.width).fill(0));
        for (let i = 0; i < this.state.height; i++) {
            for (let j = 0; j < this.state.width; j++) {
                newGrid[i][j] = (Math.floor(Math.random() * 10) % 2); // random values of zero or one to generate a random grid of walls amd empty cells
            }
        }
        newGrid[this.state.start[0]][this.state.start[1]] = 3; // special point : start
        newGrid[this.state.end[0]][this.state.end[1]] = 4; // special point : end
        this.setState({grid: newGrid});
    }
    clearGrid = () => {
        const newGrid = Array(this.state.height).fill(undefined, undefined, undefined).map(() => Array(this.state.width).fill(0));
        newGrid[this.state.start[0]][this.state.start[1]] = 3; // special point : start
        newGrid[this.state.end[0]][this.state.end[1]] = 4; // special point : end
        this.setState({grid: newGrid, pointer: []});
    }
    changeState = (x, y) => {
        if (this.state.grid[x][y] === 3) return; // check if the current point is a special point (start or end)

        let grid = this.state.grid;
        if (grid[x][y] === 0 || grid[x][y] === 2) { // if it is a visited cell or empty , make it a wall
            grid[x][y] = 1;
        } else {  // convert a wall to empty cell
            grid[x][y] = 0;
        }

        grid[this.state.start[0]][this.state.start[1]] = 3;
        grid[this.state.end[0]][this.state.end[1]] = 4;
        this.setState({grid: grid});
    }
    changeSpeed = (newSpeed) => {
        if (this.state.speed !== newSpeed){
            this.setState({speed: newSpeed});
        }
    }
    selectAlgo = (name) => this.setState({currentAlgo: name});
    visualize = async () => {
        let pointer = this.state.pointer;
        pointer[0] = this.state.start[0];
        pointer[1] = this.state.start[1];
        this.setState({pointer, visual: true});
        if (this.state.start[0] === this.state.end[0] && this.state.start[1] === this.state.end[1]) return;
        else if (this.state.currentAlgo === "dfs") await this.dfs();
        else if (this.state.currentAlgo === "dijkstra" || this.state.currentAlgo === "bfs") await this.Dijkstra();
        else if (this.state.currentAlgo === "bestfs") await this.bestfs();
        else if (this.state.currentAlgo === "a-star") await this.AStar();
        else if (this.state.currentAlgo === "tsp") await this.TSP();
    }
    findOptimalVertex = (unvisited,source) =>{
        let pq = new PriorityQueue();
        let sourceMapped = this.state.graph.map2[source];
        for (let item of unvisited){
             let destinationMapped = this.state.graph.map2[item];
            pq.enqueue(item,this.state.graph.allPairShortest[sourceMapped][destinationMapped]);
        }
        return pq.front().element;
    }
    pathdisplay = async (path) => {
        let grid = this.state.grid;
        for (let i = 1; i < path.length; i++) {
            grid[path[i][0]][path[i][1]] = 5;
            await new Promise((done) => setTimeout(() => done(), this.state.speed));
            this.setState({grid: grid});
        }
        grid[this.state.end[0]][this.state.end[1]] = 5;
        await new Promise((done) => setTimeout(() => done(), this.state.speed));
        this.setState({grid: grid});
        //To slow down the speed of Animation
        this.setState({visual: false});
    }
    clearPath = () => {
        let g = this.state.grid;
        let path = this.state.path;
        for(let i = 0; i < path.length; i++)g[path[i][0]][path[i][1]] = 2;
        this.setState({path:[]});
        this.setState({grid: g});
    }
    render() {
        return (
            <div>
                <div>
                    <Navbar randomize={this.randomizeMatrix} clearWalls={this.clearGrid} newSpeed={this.changeSpeed} multiDestination={this.multiDestination}
                            handle={this.selectAlgo} selectedAlgo={this.currentAlgo} visualize={this.visualize} clearPath = {this.clearPath}
                            multipledestinations = {this.state.multipledestinations} visual={this.state.visual}
                            toggleSource= {this.toggleSource} toggleDestination= {this.toggleDestination}/>
                </div>
                <div>
                    <Grid start={this.state.start} end={this.state.end} height={this.state.height}
                          width={this.state.width} grid={this.state.grid} changeState={this.changeState} changesourcefunc={this.changedSource} changedestfunc = {this.changedDestination}
                          pointer={this.state.pointer} changeSource = {this.state.changeSource} changeDestination = {this.state.changeDestination} />
                </div>
                <D show={this.state.modalshow} handleClose={this.hideModal} />

            </div>
        );
    }
}
export default App;