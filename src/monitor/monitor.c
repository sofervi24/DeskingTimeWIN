/**
 * Compile: g++ monitor.c -framework ApplicationServices -o monitor
 */
#include <stdlib.h>
#include <stdio.h>
#include <pthread.h>
#include <time.h>
#include <string.h>
#include <ApplicationServices/ApplicationServices.h>
#define REQUEST_CODE_TERMINATE  48
#define REQUEST_CODE_GET_VALUES 49
#define RESPONSE_CODE_UNKNOWN 100
#define RESPONSE_TAP_EVENT_ERROR 101
CFRunLoopRef monitorLoopRef;
int mouseCounter = 0;
int keyboardCounter = 0;
int streamOpened = 1;
CGEventRef monCGEventCallback(CGEventTapProxy proxy, CGEventType type,CGEventRef event, void *refcon){
    switch(type){
        case kCGEventMouseMoved:
        case kCGEventRightMouseDown:
            mouseCounter += 1;
            break;
        case kCGEventLeftMouseDown:
        case kCGEventScrollWheel:
        case kCGEventKeyDown:
        case kCGEventFlagsChanged:
            keyboardCounter += 1;
            break;
        default:
            return event;
    }
    return event;
}

void * input_listener(void * threadarg){
    while(streamOpened == 1){
        int code = getchar();
        switch(code){
            case REQUEST_CODE_TERMINATE: //0
                streamOpened = 0;
                CFRunLoopStop(monitorLoopRef);
                fprintf(stdout, "{\"status\" : true}");
                fflush(stdout);
                break;
            case REQUEST_CODE_GET_VALUES: //1
                fprintf(stdout, "{\"status\" : true , \"keyboard\" : %d , \"mouse\" : %d}", keyboardCounter, mouseCounter);
                fflush(stdout);
                keyboardCounter = 0;
                mouseCounter = 0;
                break;
            default:
                fprintf(stdout, "{\"status\" : false , \"code\" : %d }",RESPONSE_CODE_UNKNOWN);
                fflush(stdout);
                break;
        }
    }
    return NULL;
}

int main(int argc, char * argv[]){
    CGEventMask eventMask = (CGEventMaskBit(kCGEventMouseMoved) | CGEventMaskBit(kCGEventRightMouseDown) | CGEventMaskBit(kCGEventLeftMouseDown) | CGEventMaskBit(kCGEventScrollWheel) | CGEventMaskBit(kCGEventKeyDown) | CGEventMaskBit(kCGEventFlagsChanged));
    CFMachPortRef eventTap = CGEventTapCreate(kCGSessionEventTap, kCGHeadInsertEventTap, 0, eventMask, monCGEventCallback, NULL);
    if (!eventTap) {
        fprintf(stdout, "{\"status\" : false , \"code\" : %d }",RESPONSE_TAP_EVENT_ERROR);
        return 1;
    }   
    pthread_t thread;
    pthread_create(&thread,NULL,input_listener,NULL);
    CFRunLoopSourceRef runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, eventTap, 0);
    monitorLoopRef = CFRunLoopGetCurrent();
    CFRunLoopAddSource(monitorLoopRef, runLoopSource, kCFRunLoopCommonModes);
    CGEventTapEnable(eventTap, true);
    CFRunLoopRun();
    return 0;
}
