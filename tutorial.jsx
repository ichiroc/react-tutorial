var CommentBox = React.createClass({
    getInitialState: function(){
        return {data: []};
    },
    loadCommentsFromServer: function(){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data){
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit:function(comment){
        var comments = this.state.data;
        comment.id = new Date();
        comments = comments.concat([comment]);
        this.setState({data: comments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data){
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function(){
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function(){
        return(
                <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                </div>
        );
    }
});

var CommentList = React.createClass({
    render: function(){
        var commentNodes = this.props.data.map(function(comment){
            return(
                    <Comment author={comment.author} email={comment.email} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });
        return(
                <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var Comment = React.createClass({
    rawMarkup: function(){
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return {__html: rawMarkup};
    },
    render: function(){
        return(
                <div className="comment">
                <h2 className="commentAuthor">
                {this.props.author}
            </h2>
                <div className="email">{this.props.email}</div>
                <span dangerouslySetInnerHTML={this.rawMarkup()}/>
                </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState : function(){
        return {author: '', email:'', text: ''};
    },
    handleAuthorChange: function(e){
        this.setState({author: e.target.value});
    },
    handleTextChange: function(e){
        this.setState({text: e.target.value});
    },
    handleEmailChange: function(e){
        this.setState({email: e.target.value});
    },
    handleSubmit: function(e){
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        var email = this.state.email.trim();
        if(!text || !autho || !email){
            return;
        }
        this.props.onCommentSubmit({author: author, email: email, text: text});
        this.setState({author: '', text: ''});
    },
    render: function(){
        return(
                <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} />
                <input type="email" placeholder="Your email" value={this.state.email} onChange={this.handleEmailChange} />
                <input type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange} />
                <input type="submit" value="Post" />
                </form>
        );
    }
});

ReactDOM.render(
        <CommentBox url="api/comments" pollInterval={10000} />,
    document.getElementById("content")
);
