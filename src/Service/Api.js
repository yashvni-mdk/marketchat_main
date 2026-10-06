import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import axios from 'axios';

export default class Api {
  static baseUrl1 = 'https://marketchat.in/api';
  static baseUrl2 = 'https://signal.indicatorleads.com/';
  static baseUrl3 = 'https://api.marketchat.in/api';
}

export const sendPushNotification = async (token, title, body,) => {
  //console.log("token==>", token);
  
  const FIREBASE_API_KEY ="AAAAeqQVRzE:APA91bHgd0lC7bx1EpIsaxVE26paNaCDYh7oLK-XzVPPVE5_3qoVyIlYp1CIioYNKGet7_kZSkuGBUcUDbNhI-d-qwvvGlCwQNS0Du9llJhmSxNm2gqMEHedVAYHEgxW6xVOsrHI0C4X"
  
  const message = {
    registration_ids: [token],
    notification: {
      title: title,
      body: body,
      vibrate: 1,
      sound: 1,
      show_in_foreground: true,
      priority: "high",
      content_available: true
    },
  };
  
  let headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "key=" + FIREBASE_API_KEY
  });
  
  let response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers,
    body: JSON.stringify(message)
  });
     // console.log("=><*", response);
     response = await response.json();
    //  console.log("=><*", response);
  };

export const onLoginApi = async (requestData) => {
  const url = Api.baseUrl1 + `/auth`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
        },
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const onRegistrationApi = async (requestData) => {
  const url = Api.baseUrl1 + `/create-account`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
        },
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const getUserDataApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-user-data?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
        },
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const getUserArticles = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-articles?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const onBlockUserApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-blocked-users?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
        },
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const onEventUserApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-events?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
        },
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const onDeleteEventApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/events?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
        },
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const onCreateEventApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/create-event?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
        },
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export const onLogOutApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/delete-access-token?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
        },
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export const onCreateStatusApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/create-story?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
        },
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export const onGetStoriesApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-stories?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
        },
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export const onSearchApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/search?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    }).then((res) => resolve(res))
      .catch((err) => reject(err))
  })
}

export const onCreateGroupsApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/create-group?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export const onUpdatedGroupApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/update-group-data?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export const onUpdatedPageApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/update-page-data?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export const onCreatePageApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/create-page?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onUpdateUserDataApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/update-user-data?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onDeleteAccountApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/delete-user?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onCreateFunding = async (requestData, token) => {
  const url = Api.baseUrl1 + `/funding?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onFetchJobs = async (requestData, token) => {
  const url = Api.baseUrl1 + `/job?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onBlockActionApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/block-user?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}


export const onCreateAdsApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/ads?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}


export const onCreateAlbumApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/albums?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetUserAlbumsApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-user-albums?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onFetchingJobs = async (requestData, token) => {
  const url = Api.baseUrl1 + `/job?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onFollowUser = async (requestData, token) => {
  const url = Api.baseUrl1 + `/follow-user?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onLikePage = async (requestData, token, fcmToken) => {
  const url = Api.baseUrl1 + `/like-page?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onJoinGroup = async (requestData, token) => {
  const url = Api.baseUrl1 + `/join-group?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onFindFriendsApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-nearby-users?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetPostApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/posts?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onPokeUserApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/poke?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onAddToFamilyApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/add-to-family?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onNotificationDataApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-general-data?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onReportUserApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/report_user?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onAddressApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/address?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetGroupApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-group-data?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const addMemberInGroup = async (requestData, token) => {
  const url = Api.baseUrl1 + `/group_add?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const getgroupMembers = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get_group_members?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}
export const removeGroupMember = async (requestData, token) => {
  const url = Api.baseUrl1 + `/delete_group_member?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}
export const makeGroupAdmin = async (requestData, token) => {
  const url = Api.baseUrl1 + `/make_group_admin?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onReportGroup = async (requestData, token) => {
  const url = Api.baseUrl1 + `/report_group?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onReportPage = async (requestData, token) => {
  const url = Api.baseUrl1 + `/report_page?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetPageApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-page-data?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const addMembetsInPage = async (requestData, token) => {
  const url = Api.baseUrl1 + `/page_add?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}
export const onGetPageMember = async (requestData, token) => {
  const url = Api.baseUrl1 + `/not_in_page_member?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onPageLikeApi = async (requestData, token, fcmToken) => {
  const url = Api.baseUrl1 + `/post-actions?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const commentonPost = async (requestData, token, fcmToken) => {
  const url = Api.baseUrl1 + `/comments?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const reportComments = async (requestData, token, fcmToken) => {
  const url = Api.baseUrl1 + `/report_comment?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onCreateNewPostApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/new_post?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetBlogById = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-blog-by-id?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onHidePost = async (requestData, token) => {
  const url = Api.baseUrl1 + `/hide_post?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onDeleteGroup = async (requestData, token) => {
  const url = Api.baseUrl1 + `/delete_group?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetCommonTHings = async (requestData, token) => {
  const url = Api.baseUrl1 + `/common_things?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}
export const onGetMemories = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get_memories?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onDeletePage = async (requestData, token) => {
  const url = Api.baseUrl1 + `/delete_page?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetEventById = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get_event_by_id?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onInterestedEvent = async (requestData, token) => {
  const url = Api.baseUrl1 + `/interest-event?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const MidjeournyImage = async (requestData, token) => {
  const url = Api.baseUrl1 + `/ai?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const UserMessages = async (requestData, token) => {
  console.log("GET TOKEN::::",token)
  const url = Api.baseUrl1 + `/get_user_messages?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const DeleteUserMessages = async (requestData, token) => {
  const url = Api.baseUrl1 + `/delete-conversation?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const getPageMessages = async (requestData, token) => {
  const url = Api.baseUrl1 + `/page_chat?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}
export const getMostWatchedPost = async (requestData, token) => {
  const url = Api.baseUrl1 + `/most_watched?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const getGroupeMessages = async (requestData, token) => {
  const url = Api.baseUrl1 + `/group_chat?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const getChatMedia = async (requestData, token) => {
  const url = Api.baseUrl1 + `/chat?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const getGroupRequestes = async (requestData, token) => {
  const url = Api.baseUrl1 + `/groups?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onSendUserMessages = async (requestData, token) => {
  const url = Api.baseUrl1 + `/send-message?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const fetchRecommendedData = async (requestData, token) => {
  const url = Api.baseUrl1 + `/fetch-recommended?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetActivities = async (requestData, token) => {
  const url = Api.baseUrl1 + `/my_activities?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetPostData = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-post-data?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetManyUser = async (requestData, token) => {
  const url = Api.baseUrl1 + `/get-many-users-data?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onNotificationDelete = async (requestData, token) => {
  const url = Api.baseUrl1 + `/notifications?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onSearchForPost = async (requestData, token) => {
  const url = Api.baseUrl1 + `/search_for_posts?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onIndicatorRegistrationApi = async (requestData) => {
  const url = Api.baseUrl2 + `auth/register/`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAcceptDeclineApi = async (requestData, token) => {
  const url = Api.baseUrl1 + `/accept_decline_request?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onPostBlogDataApi = async (requestData, token) => {
  const url = Api.baseUrl3 + `/blogs/create`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetUserDataApi = async () => {
  const url = Api.baseUrl3 + `/users`;
  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "server_key": "ea53582bfecd4121c9cd18a8f019bd74"
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onPostFutureTradingApi = async (requestData, token) => {
  const url = Api.baseUrl3 + `/trade/futuretrades`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onPostSpotTradingApi = async (requestData, token) => {
  console.log('get Token>>>>', token);
  const url = Api.baseUrl3 + `/trade/spottrades`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onPostPinApi = async (requestData, token) => {
  console.log('get Token>>>>', token);
  const url = Api.baseUrl3 + `/pinned/insert`;
  return new Promise((resolve, reject) => {
    axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onDeletePinApi = async (requestData, token) => {
  console.log('get Token>>>>', token);
  const url = Api.baseUrl3 + `/pinned/delete`;
  return new Promise((resolve, reject) => {
    axios.delete(url, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

export const onGetPinDataApi = async (token) => {
  const url = Api.baseUrl3 + `/pinned/all?page=1&limit=10`;
  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}
