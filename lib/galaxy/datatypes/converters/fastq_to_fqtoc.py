#!/usr/bin/env python
from __future__ import print_function

import sys

from galaxy.util.checkers import is_gzip


def main():
    """
    The format of the file is JSON::

        { "sections" : [
                { "start" : "x", "end" : "y", "sequences" : "z" },
                ...
        ]}

    This works only for UNCOMPRESSED fastq files. The Python GzipFile does not provide seekable
    offsets via tell(), so clients just have to split the slow way
    """
    input_fname = sys.argv[1]
    if is_gzip(input_fname):
        sys.exit('Conversion is only possible for uncompressed files')

    current_line = 0
    sequences = 1000000
    lines_per_chunk = 4 * sequences
    chunk_begin = 0

    with open(input_fname) as in_file, open(sys.argv[2], 'w') as out_file:
        out_file.write('{"sections" : [')

        line = in_file.readline()
        while line:
            current_line += 1
            if 0 == current_line % lines_per_chunk:
                chunk_end = in_file.tell()
                out_file.write('{"start":"%s","end":"%s","sequences":"%s"},' % (chunk_begin, chunk_end, sequences))
                chunk_begin = chunk_end
            line = in_file.readline()

        chunk_end = in_file.tell()
        out_file.write('{"start":"%s","end":"%s","sequences":"%s"}' % (chunk_begin, chunk_end, (current_line % lines_per_chunk) / 4))
        out_file.write(']}\n')


if __name__ == "__main__":
    main()
