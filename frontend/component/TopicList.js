import React from 'react';
import {Link} from 'react-router';
import {getTopicList} from '../lib/client';

export default class TopicList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.updateList({
      tags: this.props.location.query.tags,
      page: this.props.location.query.page,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.updateList({
      tags: nextProps.location.query.tags,
      page: nextProps.location.query.page,
    });
  }

  updateList(query) {
    getTopicList(query)
      .then(ret => this.setState(ret))
      .catch(err => console.error(err));
  }

  render() {

    const list = Array.isArray(this.state.list) ? this.state.list : [];

    let page = parseInt(this.state.page, 10);
    if (!(page > 1)) page = 1;

    let prevPage = page - 1;
    if (prevPage < 1) prevPage = 1;

    let nextPage = page + 1;

    return (
      <div>
        <ul className="list-group">
          {list.map((item, i) => {
            return (
              <Link to={`/topic/${item._id}`} className="list-group-item" key={i}>
                {item.title}
                <span className="pull-right">{item.author.nickname} 发表于 {item.createdAt}，阅读量：{item.pageView || 0}</span>
              </Link>
            )
          })}
        </ul>
        <nav>
          <ul className="pagination">
            <li>
              <Link to={`/?page=${prevPage}`} aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </Link>
            </li>
            <li>
              <Link to={`/?page=${nextPage}`} aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}
