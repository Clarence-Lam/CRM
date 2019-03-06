/* eslint no-undef:0, no-unused-expressions:0, array-callback-return:0 */
import React, { Component } from 'react';
import { Nav } from '@alifd/next';
import { withRouter, Link } from 'react-router-dom';
import FoundationSymbol from '@icedesign/foundation-symbol';
import { asideMenuConfig } from '../../../../menuConfig';

import './Aside.scss';

const { Item, SubNav } = Nav;
@withRouter
export default class BasicLayout extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { location } = this.props;
    const { pathname } = location;

    return (
      <Nav selectedKeys={[pathname]} className="ice-menu-custom" activeDirection="right">
        {Array.isArray(asideMenuConfig) &&
          asideMenuConfig.length > 0 &&
          asideMenuConfig.map((nav) => {
            if (!nav.children) {
              return (
                <Nav.Item key={nav.path}>
                  <Link to={nav.path} className="ice-menu-link">
                    {nav.icon ? (
                      <FoundationSymbol size="small" type={nav.icon} />
                    ) : null}
                    <span className="ice-menu-item-text">{nav.name}</span>
                  </Link>
                </Nav.Item>
              );
            }
              // nav.children.map((item) => {

              // });
                return (
                  <SubNav key={nav.path}
                    icon={nav.icon ? (
                      <FoundationSymbol size="small" type={nav.icon} />
                  ) : null}
                    label={`　${nav.name}`}
                  >
                    {nav.children.map((item) => {
                        return (
                          <Nav.Item key={item.path}>
                            <Link to={item.path} className="ice-menu-link">
                              {item.icon ? (
                                <FoundationSymbol size="small" type={item.icon} />
                        ) : null}
                              <span className="ice-menu-item-text">{item.name}</span>
                            </Link>
                          </Nav.Item>);
                    })}
                  </SubNav>
                );
          })}
      </Nav>
    );
  }
}
