var CommentBox = React.createClass({
    getInitialState: function(){
        return {data: []};
    },
    componentDidMount: function(){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data){
                this.setState({data:data});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function(){
        return(
                <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                </div>
        );
    }
});

var CommentList = React.createClass({
    render: function(){
        var commentNodes = this.props.data.map(function(comment){
            return(
                    <Comment author={comment.author} key={comment.id}>
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
                <span dangerouslySetInnerHTML={this.rawMarkup()}/>
                </div>
        );
    }
});

ReactDOM.render(
        <CommentBox url="api/comments" />,
    document.getElementById("content")
);
