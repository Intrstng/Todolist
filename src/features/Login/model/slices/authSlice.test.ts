import {beforeEach, describe, expect, it} from 'vitest'
import {authActions, authReducer, LoginState} from './authSlice'

describe('authReducer', () => {
  let isLoggedIn: boolean
  let newIsLoggedIn: boolean
  let loginState: LoginState

  // We can use tests without beforeEach() because we work with PURE functions
  beforeEach(() => {
    isLoggedIn = false
    newIsLoggedIn = true
    loginState = {
      isLoggedIn: isLoggedIn
    }
  })

  // ------------------- 'SET_IS_LOGGED_IN' ------------------- //

  it('should SET_IS_LOGGED_IN', () => {
    // const loginParams = {
    //   email: 'test@example.com',
    //   password: 'password123',
    //   rememberMe: true
    // }
    const loginAction = {
      type: authActions.login.fulfilled.type,
      payload: { isLoggedIn: true }
    }

    // action
    const newState = authReducer(loginState, loginAction)

    // expectation
    expect(loginState.isLoggedIn).toBe(isLoggedIn)
    expect(newState.isLoggedIn).toBe(newIsLoggedIn)
  })

  it('should update state when login async thunk is fulfilled', async () => {
    // Create a mock store with the reducer
    // const store = configureStore({
    //   reducer: {
    //     auth: authReducer
    //   }
    // })

    // Note: This will actually try to make an API call, so mocking of the API
    const fulfilledAction = {
      type: authActions.login.fulfilled.type,
      payload: { isLoggedIn: true }
    }

    const result = authReducer(loginState, fulfilledAction)

    expect(result.isLoggedIn).toBe(true)
  })
})