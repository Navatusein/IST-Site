"use client"

import {Component, ReactNode} from "react";
import {Alert} from "antd";

interface IProps {
  resetKey?: unknown;
  fallbackTitle?: string;
  children: ReactNode;
}

interface IState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<IProps, IState> {
  state: IState = {hasError: false};

  static getDerivedStateFromError(): IState {
    return {hasError: true};
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey)
      this.setState({hasError: false});
  }

  render() {
    if (this.state.hasError)
      return <Alert type="error" title={this.props.fallbackTitle ?? "Не вдалось відобразити"}/>;

    return this.props.children;
  }
}
