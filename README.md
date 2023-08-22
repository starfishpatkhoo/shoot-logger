# Patrick's Recording / Streaming Logger

## Keep track of takes or highlights while recording or streaming

Trying to keep track of what you recorded and what you can use in the final edit is a major time consuming problem. One needs to keep track of which digital file contains which take(s), the timecodes of when each take starts/ends, if it was a good/bad take, and what the take was about/for. On big(ger) productions, there is usually an AD or script supervisor who keeps track of this sort of thing on set, and communicates that to the editors in post-production. But adding an extra human being to record all this information is incredibly expensive.

So having a simple tool you can use to quickly _(hint: keyboard shortcuts)_ record all this information (by yourself if necessary) is very useful.

Of course the timecodes here are not precise/exact (we don't have a Tentacle Sync after all), so it may be off by a few frames/miliseconds/seconds when you open your files in your favourite editor. But hopefully, it saves you a lot of time/effort in scrubbing your video files looking for that one good take or highlight.

## Workflow: One File, Many Takes

In my normal workflow, I tend to record multiple takes continuously (multiple takes in a single recording). This creates a single long recording file with many takes, rather than many small files (each with one take). This is also the workflow for streaming or Zoom because you can't start/stop a stream or Zoom room whenever you like, just to pick out a good/bad highlight (take).

## Workflow: One Take per File

If your workflow is one where you start a new recording for each individual take (one take per recording) and create many small files, you can still use this tool by noting the `File #` and/or using the comment field to indicate the file name/recording number instead. Just remember that recordings that have no good takes in it are ignored and not saved to the `Take Log`.

For full instructions, please read the Help section in the Logger itself.

### Ideas:

* Confirmation prompt to stop camera rolling? Do we (really) need a "Are you sure?" prompt before stopping the recording session?
* Create an EDL? Not too sure since it could be that certain parts inside a good take should actually be edited out.
* Allow a take to be marked as "bad" later on? Just use the comments as a workaround? Or delete it after copy and pasting?
* Can we have an option to mute the logger sounds? Just use the computer or browser tab's mute function? Otherwise include this sound in the recording as a "clapper" for audio sync in post?

### Integration with other Apps / Systems

It would be great to be able to sync up with Blackmagic ATEM switchers on start/stop recordings, set the recording name, etc. Unfortunately, this is unlikely to happen natively because ATEM communicates via proprietary UDP protocol and not over standard HTTP. It would need an extra layer in between like Bitfocus Companion or OpenSwitcher.

Another useful integration would be with timecode generators like Tentacle Sync. Unfortunately, this too will likely require a layer in between.

---

Copyright 2023 (c) Patrick Khoo @ https://deepwave.net  
Version: 1.1-20230821  
