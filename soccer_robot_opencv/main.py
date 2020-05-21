import sys
import cv2
import signal

def receiveSignal(signalNumber, frame):
	print ('Received:', signalNumber)
	print ('(Ctrl+C) terminating the process')
	sys.exit(-1)
	return

if __name__ == '__main__':
	# register the signals to be caught
	signal.signal(signal.SIGINT, receiveSignal)
	cv2.destroyAllWindows()
	
if len(sys.argv) >= 2:
	modality = sys.argv[1]
	if modality == "get_sample_image":
		print ("[INFO] Start take picture!")
		import get_sample_image
	if modality == "set_hsv_param":
		if len(sys.argv) >= 3:
			object = sys.argv[2]
			print ("[INFO] Start setting of hsv parameters!")
			import set_hsv_param
			set_hsv_param.set_object_to_detect(object)
			set_hsv_param.start_main()
		else:
			print ("[ERROR] hvs param: set object to detect!")

else:
	print ("[INFO] Start Find object!")
	import capture
