import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { Balloon, Icon, Nav } from '@alifd/next';
import FoundationSymbol from '@icedesign/foundation-symbol';
import IceImg from '@icedesign/img';
import { headerMenuConfig } from '../../../../menuConfig';
import Logo from '../Logo';
import './Header.scss';

@withRouter
export default class Header extends Component {
  state = {
    user: {},
  };
  getUserProfile = () => {
    axios
      .post('/api/test', {
        abc: '123',
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  logout = () => {
    this.props.history.push('/user/login');
    axios
      .post('/api/logout')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  getSession = async () => {
    await axios
      .get('api/getSession')
      .then((response) => {
        if (response.status === 200) {
          const { isLogin, userId, userName, name, authority } = response.data;
          global.user = { isLogin, userId, userName, name, authority };
          const user = { isLogin, userId, userName, name, authority };
          this.setState({
            user,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async componentWillMount() {
    await this.getSession();
  }
  render() {
    const { location = {} } = this.props;
    const { pathname } = location;
    return (
      <div className="header-container">
        <div className="header-content">
          <Logo isDark />
          <div className="header-navbar">
            <Nav
              className="header-navbar-menu"
              onClick={this.handleNavClick}
              selectedKeys={[pathname]}
              defaultSelectedKeys={[pathname]}
              direction="hoz"
              type="secondary"
            >
              {headerMenuConfig &&
                headerMenuConfig.length > 0 &&
                headerMenuConfig.map((nav, index) => {
                  if (nav.children && nav.children.length > 0) {
                    return (
                      <Nav.SubNav
                        triggerType="click"
                        key={index}
                        title={
                          <span>
                            {nav.icon ? (
                              <FoundationSymbol size="small" type={nav.icon} />
                            ) : null}
                            <span>{nav.name}</span>
                          </span>
                        }
                      >
                        {nav.children.map((item) => {
                          const linkProps = {};
                          if (item.external) {
                            if (item.newWindow) {
                              linkProps.target = '_blank';
                            }

                            linkProps.href = item.path;
                            return (
                              <Nav.Item key={item.path}>
                                <a {...linkProps}>
                                  <span>{item.name}</span>
                                </a>
                              </Nav.Item>
                            );
                          }
                          linkProps.to = item.path;
                          return (
                            <Nav.Item key={item.path}>
                              <Link {...linkProps}>
                                <span>{item.name}</span>
                              </Link>
                            </Nav.Item>
                          );
                        })}
                      </Nav.SubNav>
                    );
                  }
                  const linkProps = {};
                  if (nav.external) {
                    if (nav.newWindow) {
                      linkProps.target = '_blank';
                    }
                    linkProps.href = nav.path;
                    return (
                      <Nav.Item key={nav.path}>
                        <a {...linkProps}>
                          <span>
                            {nav.icon ? (
                              <FoundationSymbol size="small" type={nav.icon} />
                            ) : null}
                            {nav.name}
                          </span>
                        </a>
                      </Nav.Item>
                    );
                  }
                  linkProps.to = nav.path;
                  return (
                    <Nav.Item key={nav.path}>
                      <Link {...linkProps}>
                        <span>
                          {nav.icon ? (
                            <FoundationSymbol size="small" type={nav.icon} />
                          ) : null}
                          {nav.name}
                        </span>
                      </Link>
                    </Nav.Item>
                  );
                })}
            </Nav>
            <Balloon
              triggerType="click"
              trigger={
                <div
                  className="ice-design-header-userpannel"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 12,
                  }}
                >
                  {/* <IceImg
                    height={40}
                    width={40}
                    src={require('./images/avatar.png')}
                    className="user-avatar"
                  /> */}
                  <div className="user-profile">
                    <span className="user-name" style={{ fontSize: '13px' }}>
                      {this.state.user.name}
                    </span>
                    <br />
                    {/* <span className="user-department">技术部</span> */}
                  </div>
                  <Icon type="arrow-down" size="xxs" className="icon-down" />
                </div>
              }
              closable={false}
              className="user-profile-menu"
            >
              <ul>
                <li className="user-profile-menu-item">
                  <Link to="/setting">
                    <FoundationSymbol type="repair" size="small" />
                    设置
                  </Link>
                </li>
                <li className="user-profile-menu-item" onClick={this.getUserProfile}>
                  <FoundationSymbol type="home2" size="small" />
                  用户信息
                </li>
                <li className="user-profile-menu-item" onClick={this.logout}>
                  {/* <Link to="/user/login"> */}
                  <FoundationSymbol type="compass" size="small" />
                    退出
                  {/* </Link> */}
                </li>
              </ul>
            </Balloon>
          </div>
        </div>
      </div>
    );
  }
}
