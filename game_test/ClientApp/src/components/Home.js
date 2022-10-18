import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;
    
    static assets = {
        wellDone: { url: `${process.env.PUBLIC_URL}/assets/images/png/well_done.png`, description: 'well done' },
        tryAgain: { url: `${process.env.PUBLIC_URL}/assets/images/gif/oh-no.gif`, description: 'well done' },
        gameOver: { url: `${process.env.PUBLIC_URL}/assets/images/gif/gameover_2.gif`, description: 'well done' },
    };
        
    constructor(props) {
        super(props);
        this.state = {
            start: true,
            choice: 0, 
            realValue: 0,
            live: 10,
            score: 0,
            ready: true,
            reactionImage: null,
            numMin: 0,
            numMax: 99,
            level: "easy",
            gameRange: [],
        };        
        this.tryToGuess = this.tryToGuess.bind(this, Home);
        this.populateRange = this.populateRange.bind(this, Home);
        this.killer = this.killer.bind(this);
        this.restart = this.restart.bind(this);
        this.setScore = this.setScore.bind(this);
        this.readyToPlay = this.readyToPlay.bind(this);
        this.getRealNumber = this.getRealNumber.bind(this);     
        this.changeLevel = this.changeLevel.bind(this);             
    }

    async getRealNumber() {
        const response = await fetch(`game/generateNumber/${this.state.numMin}/${this.state.numMax}`);
        const data = await response.json();
        this.setState({ realValue: data });                
    }

    async getRange(levelText) {
        const response = await fetch(`game/generateRange/${levelText}`);
        const data = await response.json();
        this.setState({ gameRange: data });

        this.state.numMin = data[0];
        this.state.numMax = data[1];   
    }

    async populateRange() {
        this.getRange("easy");
    }

    changeLevel(numb) {
        let levelText = "easy";
        if (numb == 1) {
            this.setState({
                levelText: "hard"
            });
            levelText = "hard";
        } else {
            this.setState({
                levelText: "easy"
            });
        }
        this.getRange(levelText);
    }

    tryToGuess() {        
        if (this.state.choice == this.state.realValue) {
            this.setScore()
            this.setState({
                reactionImage: Home.assets.wellDone
            });     
            this.populateRange();        
            setTimeout(() => {                
                this.setState({
                    reactionImage: null
                });
            }, 1000);                
            this.getRealNumber();
        }
        else if ((this.state.choice > this.state.realValue || this.state.choice < this.state.realValue)
            && this.state.live > 0) {
            if (this.state.live == 1) {
                this.setState({
                    reactionImage: Home.assets.gameOver
                });
                this.killer();
                this.readyToPlay();            
                setTimeout(() => {                    
                    this.restart();
                    this.setState({
                        reactionImage: null
                    });   
                    this.readyToPlay(); 
                }, 3000);
                
            } else {
                this.killer();
                this.setState({
                    reactionImage: Home.assets.tryAgain
                });

                if (this.state.choice < this.state.realValue) {
                    console.log(this.state.realValue)
                    alert("HI: the mystery number is > the player's guess")
                } else {
                    console.log(this.state.realValue)
                    alert("LO: the mystery number is < the player's guess")
                }

                setTimeout(() => {
                    this.setState({
                        reactionImage: null
                    });
                }, 2500);   

            }
        }
    }

    readyToPlay() {
        this.setState({
            ready: !this.state.ready
        });
    }

    changeValue(numb) {
        this.setState({
            choice: numb
        });
    }

    killer() {
        this.setState({
            live: this.state.live - 1
        });
    }

    restart() {
        this.setState({
            live: 3
        });
    }

    setScore() {
        this.setState({
            score: this.state.score + 1
        });
    }

    componentDidMount() {        
        this.populateRange();        
    }

    componentDidUpdate() {
        if (this.state.start != false) {
            this.getRealNumber();
            this.state.start = !this.state.start;
        }            
    }

    render() {
        return (
            <>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h3>Score: <strong style={{ color: '#1e3799' }}>{this.state.score}</strong></h3>
                        <h4>Level: <strong style={{ color: '#079992'}}>{this.state.level}</strong></h4>
                        <select onChange={e => this.changeLevel(e.target.value)}>
                            <option value="0">Easy</option>
                            <option value="1">Hard</option>
                        </select>
                    </div>
                    <div>
                        <h3>{
                            this.state.live == 0
                                ? <img src={`${process.env.PUBLIC_URL}/assets/images/png/heart.png`} key='life_zero' alt="life" style={{
                                    width: '2.5rem', maxWidth: '3.7rem', filter: 'grayscale(100)'
                                }} />
                                : Array.apply(null, Array(this.state.live)).map((i, n) =>
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/png/heart.png`} key={`life` + n} alt="life" style={{
                                        width: '2.5rem', maxWidth: '3.7rem'
                                    }} />
                                )} {this.state.live > 1 ? 'Lives' : 'Life' }: {this.state.live}
                        </h3>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h1 style={{
                        color: '#ff9f1a',
                        fontWeight: 'bolder',
                        rotate: '-10deg'
                    }} >Mystery <br />Number !</h1>
                    <h4 style={{
                        marginTop: '5vh',
                        marginBottom: '3rem'
                    }} >Choice an number between {this.state.numMin} and {this.state.numMax}</h4>
                    <input
                        className="choice"
                        type="number"
                        min={Home.numMin}
                        max={Home.numMax}
                        value={this.state.choice}
                        onChange={e => this.changeValue(e.target.value)}
                    />
                    <h3 style={{
                        marginTop: '2rem',
                        marginBottom: '1.4rem'
                    }} >Your chose {this.state.choice}</h3>
                    
                    {this.state.ready ? (
                        <button className="btn btn-primary" onClick={this.tryToGuess} style={{                            
                            marginBottom: '1rem'
                        }} >Let's go</button>
                    ) : null}

                    {this.state.reactionImage ? (
                        <div>
                            <img src={this.state.reactionImage.url}
                                alt={this.state.reactionImage.description}
                                style={{ width: '100%', maxWidth: '300px' }} />
                        </div>
                    ) : null}  
                    
                </div>
                
            </>
        );
    }

}
