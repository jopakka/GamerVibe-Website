"use strict";
/**
 *
 * @param {} list passes a list of blocked users specific to the current user.
 *  creates the blocked list on the follower page. Each blocked username has a event listener
 *  to make a call to unblock the user.
 */
const createBlockList = (list) => {
  blockedListContainer.innerHTML = "";

  if (list.length != 0) {
    blockListSection.classList.remove("hide");
    followingTitle.classList.remove("hide");
  } else {
    blockListSection.classList.add("hide");
    followingTitle.classList.remove("hide");
  }

  for (let i = 0; i < list.length; i++) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item-div");

    const newHeader = document.createElement("h3");
    newHeader.classList.add("account-labels");
    newHeader.innerText = list[i].BlockedUsername;

    const unblockSpan = document.createElement("span");
    unblockSpan.setAttribute("id", "js-unblock-btn");
    unblockSpan.innerHTML = `<i class="fas fa-check"></i><p>Unblock</p>`;

    itemDiv.append(newHeader, unblockSpan);
    blockedListContainer.append(itemDiv);

    unblockSpan.addEventListener("click", async (Event) => {
      Event.stopImmediatePropagation();
      Event.preventDefault();
      console.log(list[i].blocking_id);
      const data = list[i].blocking_id;
      const check = confirm(`"Do you want to unblock ${list[i].BlockedUsername}?`);
      if (check) {
        try {
          const options = {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blockedId: data,
            }),
          };

          const response = await fetch(url + "/block/", options);
          const blockedUserResponse = await response.json();
          console.log("blocked user response " + JSON.stringify(blockedUserResponse, null, 1));
          if (blockedUserResponse != null) {
            alert(`${list[i].BlockedUsername} has been unblocked`);
            location.reload();
          }
        } catch (e) {
          console.log(e.message);
        }
      } else {
        alert(`${list[i].BlockedUsername} was not blocked`);
      }
    });
  }
};

/**
 *  Call request to get a list of users blocked by current user. Then passes the response to
 *  createBlockList function.
 */
const getBlockedList = async () => {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };

    const response = await fetch(url + "/block/", options);
    const blockedUserList = await response.json();
    if (blockedUserList != null) {
      createBlockList(blockedUserList);
    }
  } catch (e) {
    console.log(e.message);
  }
};

getFollowerPosts();
getBlockedList();
