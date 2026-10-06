export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA-SUCCESS'
export const FETCH_ARTICLES = 'FETCH_ARTICLES'
export const FETCH_BLOCKLIST = 'FETCH_BLOCKLIST'
export const FETCH_EVENTS = 'FETCH_EVENTS'
export const LOGOUT = 'LOGOUT'
export const CREATE_GROUP = 'CREATE_GROUP'
export const FETCH_USERS_GROUPS = 'FETCH_USERS_GROUPS'
export const CREATE_PAGE = 'CREATE_PAGE'
export const FETCH_PAGES = 'FETCH_PAGES'
export const FETCH_JOBS = 'FETCH_JOBS'
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT'
export const CREATE_FUNDING = 'CREATE_FUNDING'
export const POST_DATA = 'POST_DATA'
export const GET_USER_LIST = 'GET_USER_LIST'

export const loginUser = (userData, access_token) => {
    console.log('Attempting to login with userData', userData, access_token);
    return {
        type: LOGIN_SUCCESS,
        payload: { userData, access_token },
    };
};


export const fetchUserDataSuccess = (user_data, following, followers, liked_pages, joined_groups) => {
    console.log('Attempting to fetch the user_data with followers and followings', liked_pages, joined_groups);
    return {
        type: FETCH_USER_DATA_SUCCESS,
        payload: { user_data, followers, following, liked_pages, joined_groups },
    };
};

export const fetchArticles = (articles) => {
    return {
        type: FETCH_ARTICLES,
        payload: { articles }
    };
};

export const fetchblockUsers = (blocked_users) => {
    return {
        type: FETCH_BLOCKLIST,
        payload: { blocked_users }
    };
};

export const fetchAllEvents = (events, my_events, going, interested, invited, past) => {
    return {
        type: FETCH_EVENTS,
        payload: { events, my_events, going, interested, invited, past }
    }
}

export const createGroups = (group_data) => {
    return {
        type: CREATE_GROUP,
        payload: { group_data }
    }
}

export const fetchUserGroups = (groups) => {
    return {
        type: FETCH_USERS_GROUPS,
        payload: { groups }
    }
}

export const createPages = (page_data) => {
    return {
        type: CREATE_PAGE,
        payload: { page_data }
    }
}

export const fetchAllPage = (pages) => {
    return {
        type: FETCH_PAGES,
        payload: { pages }
    }
}

export const fetchAlljobs = (jobs) => {
    return {
        type: FETCH_JOBS,
        payload: { jobs }
    };
};

export const createFundings = (funding) => {
    return {
        type: CREATE_FUNDING,
        payload: { funding }
    };
};

export const logoutuser = () => {
    console.log('Attempting logout');
    return {
        type: LOGOUT,
    };
};

export const deleteUserAccount = () => {
    return {
        type: DELETE_ACCOUNT
    }
}

export const fetchUserPost = (posts) => {
    return {     
        type: POST_DATA,
        payload: {posts}
    }
}

export const fetchUserList = (usersList) => {
    return {     
        type: GET_USER_LIST,
        payload: usersList
    }
}



// Initial State
const initialState = {
    userData: null,
    access_token: null,
    user_data: [],
    followers: [],
    following: [],
    liked_pages: [],
    joined_groups: [],
    articles: [],
    blocked_users: [],
    events: [],
    my_events: [],
    going: [],
    interested: [],
    invited: [],
    past: [],
    usersList: [],
    pages: [],
    groups: [],
    jobs: [],
    fundings: [],
    errors: null,
    posts: []
};

// Reducer
const rootReducer = (state = initialState, action) => {
    // console.log("Get USer Data::::", state.user_data);
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                userData: action.payload.userData,
                access_token: action.payload.access_token,
                errors: null
            };
        case FETCH_USER_DATA_SUCCESS:
            return {
                ...state,
                user_data: action.payload.user_data ? action.payload.user_data : state.user_data,
                followers: action.payload.followers ? action.payload.followers : state.followers,
                following: action.payload.following ? action.payload.following : state.following,
                liked_pages: action.payload.liked_pages ? action.payload.liked_pages : state.liked_pages,
                joined_groups: action.payload.joined_groups ? action.payload.joined_groups : state.joined_groups,
                errors: null
            };
        case FETCH_ARTICLES:
            return {
                ...state,
                articles: action.payload.articles
            }
        case FETCH_BLOCKLIST:
            return {
                ...state,
                blocked_users: action.payload.blocked_users
            }
        case FETCH_EVENTS:
            return {
                ...state,
                events: action.payload.events,
                my_events: action.payload.my_events,
                going: action.payload.going,
                interested: action.payload.interested,
                invited: action.payload.invited,
                past: action.payload.past
            }
        case FETCH_USERS_GROUPS:
            return {
                ...state,
                groups: action.payload.groups
            }
        case POST_DATA:
            return {
                ...state,
                posts: action.payload.posts
            }
        case FETCH_PAGES: {
            return {
                ...state,
                pages: action.payload.pages,
            }
        }
        case CREATE_GROUP:
            return {
                ...state,
                groups: [...state.groups, action.payload]
            }
        case CREATE_PAGE:
            return {
                ...state,
                pages: [...state.pages, action.payload]
            }
        case FETCH_JOBS:
            return {
                ...state,
                jobs: action.payload.jobs
            }
        case GET_USER_LIST:
            console.log('getrUSer Data::::', action.payload)
                return {
                    ...state,
                    usersList: action.payload
                }
        case CREATE_FUNDING:
            return {
                ...state,
                fundings: [...state.fundings, action.payload]
            }
        case DELETE_ACCOUNT:
            return {
                ...initialState
            }
        case LOGOUT:
            return {
                ...state,
                userData: null,
                access_token: null
            }
        default:
            return state;
    }
};

export default rootReducer; 