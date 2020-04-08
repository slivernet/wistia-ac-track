# Wistia AC track

Track view percentages of wistia videos in ActiveCampaign as event tracking.

Steps to install.
1. Enable event tracking in settings->Tracking->Event Tracking and add a `videoTrack` event
1. Create a glitch project by clicking here https://glitch.com/edit/#!/remix/wistia-ac. Put in your `actid` and `eventKey` in the `.env` file, you can find these in the Event Tracking settings area.
1. Add your glitch project created in the step above to the `acProxyUrl` in the config at the bottom of wistia-ac-track.js.
1. Place wistia-ac-track.js on any page you want to track wistia videos.
1. Make sure the link on the page you are tracking contains a url paramater `acEmail` with the value being an email in your ActiveCampgain account.

Now when a contact watches a video you will see event tracking data and will be able to segment based on this.

# Todo
- Ability to customize the script without having to edit it, so we can host it on a CDN.
- Use the API to turn on and create the videoTrack event
- Ability to work with contact_ids as well by using the API to query the email address of a contact_id
- Use the API to tag contacts based on viewing.
- Optionally get contact id/email through a cookie
- Create a repo for the glitch project and then use https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=$URL to remix.
- Instead of using glitch could possibly use a CORS proxy like https://github.com/Zibri/cloudflare-cors-anywhere, though doing that would negate the possibility of working with the API in the future.
